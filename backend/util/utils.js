import jwt from "jsonwebtoken";
import {ROUTE_CODES, TRAVEL_STATUS, USER_ROLES} from "../constants/constants.js";
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import Travel from "../models/travelModel.js";
import Holiday from "../models/holidayModel.js";
import {calculateNumOfWorkingDays} from "../controllers/travelController.js";

export const createJwtToken = (_id, role, fullName) => {
    return jwt.sign({_id, role, fullName}, process.env.SECRET, {expiresIn: '1d'})
};

export const getLoggedInUserId = async (req) => {

    //Verify if the user is authenticated
    let adminOrUser = null
    let {_id, role} = await getUserIdAndRoleAfterAuthenticating(req)
    try {
        if (role === USER_ROLES.ADMIN) {
            adminOrUser = await Admin.findOne({_id}).select('_id')
        } else if (role === USER_ROLES.USER) {
            adminOrUser = await User.findOne({_id}).select('_id')
        }
    } catch (error) {
        console.error(error)
    }

    return adminOrUser

}

export const getLoggedInUser = async (req) => {

    //Verify if the user is authenticated
    let adminOrUser = null
    let {_id, role} = await getUserIdAndRoleAfterAuthenticating(req)
    try {
        if (role === USER_ROLES.ADMIN) {
            adminOrUser = await Admin.findOne({_id})
        }
    } catch (error) {
        console.error(error)
    }

    return adminOrUser
}

export const getUser = async (id) => {

    //Verify if the user is authenticated
    let user = null
    try {
        user = await User.findOne({"_id": id})
    } catch (error) {
        console.error(error)
    }

    return user
}

//Validating the time stamp
export const isTimeStampValid = (timeStamp) => {
    const date = new Date(timeStamp);
    return date instanceof Date;
}

const getUserIdAndRoleAfterAuthenticating = async (req) => {

    //Verify if the user is authenticated
    let decodedToken = null
    const {authorization} = req.headers
    const token = authorization.split(' ')[1]
    try {
        decodedToken = jwt.verify(token, process.env.SECRET);
    } catch (error) {
        console.error(error)
    }

    if (!decodedToken) return null

    const {_id, role} = decodedToken
    return {_id, role}
}

/**
 * This method will return the list of users with less utilization efficiencies
 * @returns {Promise<*[]>}
 */
export const getLessEfficientUsers = async () => {

    // The starting date should be 1st day of the current month
    const fromDate = new Date(new Date().setDate(1)).getTime()

    // The end date should be the 15th day of the current month
    // But since we are executing the cron job on the 15th day of the month, we can just set the end date to be current date
    const toDate = new Date().getTime()

    // Get utilization efficiencies and users for the given time period
    return await getUsersWithUtilizationEfficiencies(fromDate, toDate)
};

export const getRouteNameFromCode = (code) => {

    if (!code) return "unknown"
    return ROUTE_CODES.find(route => route.code === code).desc
}

const getUsersWithUtilizationEfficiencies = async (fromDate, toDate) => {

    // Get all the travel records for the given date range
    // const travelRecordsForDateRange = await Travel.getTravelRecords(fromDate, toDate);
    const travelRecordsForDateRange = await Travel.getTravelRecords(fromDate, toDate);
    const users = await User.getAllUsers();

    // Group travel records with the users
    const travelRecordsOfUsers = [];
    for (const user of users) {

        const travelRecordsOfUser = []
        for (const travelRecord of travelRecordsForDateRange) {
            if (user._id === travelRecord.userId) {
                travelRecordsOfUser.push(travelRecord);
            }
        }

        let obj = {}
        obj.userId = user._id
        obj.email = user.email
        obj.fullName = user.fullName
        obj.travelRecords = travelRecordsOfUser
        travelRecordsOfUsers.push(obj)
    }

    // Calculate the utilization efficiency for each user
    const userRecords = []
    for (const userTravelRecord of travelRecordsOfUsers) {
        const {userId, fullName, email} = userTravelRecord
        let userRecord = {}
        userRecord.userId = userId
        userRecord.fullName = fullName
        userRecord.email = email
        userRecord.utilizationEfficiency = await getUtilizationEfficiencyForUser(userTravelRecord.travelRecords, fromDate, toDate)
        userRecords.push(userRecord)
    }

    // Find the users  with utilization efficiency less than 30%
    const usersWithLessUtilizationEfficiencies = []
    for (const userRecord of userRecords) {
        if (userRecord.utilizationEfficiency <= 30) {
            usersWithLessUtilizationEfficiencies.push(userRecord)
        }
    }

    return usersWithLessUtilizationEfficiencies
};

const getUtilizationEfficiencyForUser = async (travelRecords, fromDate, toDate) => {

    let arrivalOnlyCount = 0;
    let departureOnlyCount = 0;
    let fullDayCount = 0;

    for (const travelRecord of travelRecords) {
        if (travelRecord.status === TRAVEL_STATUS.MORNING) arrivalOnlyCount++;
        if (travelRecord.status === TRAVEL_STATUS.EVENING) departureOnlyCount++;
        if (travelRecord.status === TRAVEL_STATUS.BOTH) fullDayCount++;
    }

    const holidaysForDateRange = await Holiday.getHolidaysForDateRange(fromDate, toDate)
    const numOfWorkingDays = calculateNumOfWorkingDays(fromDate, toDate, holidaysForDateRange)

    return (((arrivalOnlyCount + departureOnlyCount + fullDayCount) / numOfWorkingDays) * 100).toFixed(2);
};
