import {getLoggedInUser, getLoggedInUserId, getRouteNameFromCode, getUser, isTimeStampValid} from "../util/utils.js";
import User from "../models/userModel.js";
import Travel from "../models/travelModel.js";
import Holiday from "../models/holidayModel.js";
import {TRAVEL_STATUS} from "../constants/constants.js";

export const getTravelData = async (req, res) => {

    const {fromDate, toDate} = req.body;
    const userId = await getLoggedInUserId(req);
    let travelRecords = null
    try {

        if (!fromDate || !toDate) {
            return res.status(400).json({error: "No adequate information in the payload"})
        }

        travelRecords = await Travel.getTravelRecordsForUser(fromDate, toDate, userId);
        let holidays = await Holiday.getHolidaysForDateRange(fromDate, toDate);
        holidays.map(holiday => holiday.status = "0")

        let recordsIncludingHolidays = travelRecords.concat(holidays)
        if (recordsIncludingHolidays) {
            return res.status(200).json([...recordsIncludingHolidays]);
        }
        return res.status(400).json({error: "No records found for the date range"})

    } catch (error) {
        return res.status(400).json({error: error.message});
    }
};

export const updateTravelStatus = async (req, res) => {

    const {date, status} = req.body;
    const userId = await getLoggedInUserId(req);
    try {
        const travelRecord = await Travel.updateTravelStatus(
            date,
            status,
            userId
        );
        res.status(200).json({_id: travelRecord._id, date: travelRecord.date, status: travelRecord.status});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

export const getReportData = async (req, res) => {

    const admin = await getLoggedInUser(req);
    if (!admin) {
        return res.status(400).json({error: "Only admin users can access the details"})
    }

    const {fromDate, toDate} = req.body;
    try {
        let reportData;
        if (!fromDate || !toDate) {
            return res.status(400).json({error: "No adequate information in the payload"})
        }

        reportData = await getReportDataWhenDatesAreProvided(fromDate, toDate);
        return res.status(200).json(reportData);
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
};

export const getReportDataWhenDatesAreProvided = async (fromDate, toDate) => {

    if (!isTimeStampValid(fromDate) || !isTimeStampValid(toDate)) {
        throw new Error("Invalid Time Stamp");
    }

    let travelRecords = await Travel.getTravelRecords(fromDate, toDate);
    let holidays = await Holiday.getHolidaysForDateRange(fromDate, toDate)
    travelRecords.numOfWorkingDays = calculateNumOfWorkingDays(fromDate, toDate, holidays)
    if (!travelRecords || travelRecords.length === 0) {
        throw new Error('No records found for the given date range')
    }

    let reportData = await getReportDataForUsers(travelRecords)
    return reportData
};

export const calculateNumOfWorkingDays = (fromDate, toDate, holidays) => {

    const start = new Date(parseInt(fromDate)); // Convert the string timestamp to an integer and create a Date object
    const end = new Date(parseInt(toDate)); // Convert the string timestamp to an integer and create a Date object
    let workingDays = 0;

    // Iterate over each day in the date range
    while (start <= end) {
        const day = start.getDay();
        // Check if the day is a weekend (Saturday or Sunday) or a holiday
        if (day !== 0 && day !== 6 && !isHoliday(start, holidays)) {
            workingDays++;
        }
        start.setDate(start.getDate() + 1); // Move to the next day
    }

    return workingDays;
}

export const isHoliday = (date, holidays) => {
    const formattedDate = date.toISOString().split('T')[0];
    return holidays.includes(formattedDate);
}

export const getReportDataForUsers = async (travelRecords) => {

    let userData = []
    let userIds = []

    let userGroups = travelRecords.reduce((groups, record) => {
        let userId = record.userId;
        if (!groups[userId]) {
            groups[userId] = {
                arrivalCount: 0,
                arrivalOnlyCount: 0,
                departureCount: 0,
                departureOnlyCount: 0,
                fullDayCount: 0 //Num of days of where the user used both arrival and departure in the same day
            };
        }
        if (record.status === TRAVEL_STATUS.MORNING) {
            groups[userId].arrivalCount++;
            groups[userId].arrivalOnlyCount++;
        }
        if (record.status === TRAVEL_STATUS.EVENING) {
            groups[userId].departureCount++;
            groups[userId].departureOnlyCount++;
        }
        if (record.status === TRAVEL_STATUS.BOTH) {
            groups[userId].arrivalCount++;
            groups[userId].departureCount++;
            groups[userId].fullDayCount++;
        }
        return groups;
    }, {});

    userData = Object.keys(userGroups).map((userId) => {
        let {arrivalCount, departureCount, arrivalOnlyCount, departureOnlyCount, fullDayCount} = userGroups[userId]
        let userUtilizationEfficiency = (((arrivalOnlyCount + departureOnlyCount + fullDayCount) / travelRecords.numOfWorkingDays) * 100).toFixed(2) + '%';
        return {
            userId,
            userArrivalCount: arrivalCount,
            userDepartureCount: departureCount,
            numOfDays: arrivalOnlyCount + departureOnlyCount + fullDayCount,
            userUtilizationEfficiency
        };
    });

    for (let userRecord of userData) {
        let user = await getUser(userRecord.userId);
        userRecord.fullName = user.fullName;
        userRecord.route = getRouteNameFromCode(user.route);
        userIds.push(userRecord.userId)
        delete userRecord.userId
    }

    //Add users who are not in the current list
    const usersWithoutTravelRecords = await User.find({_id: {$nin: userIds}}).exec();
    if (usersWithoutTravelRecords && usersWithoutTravelRecords.length > 0) {
        for (let user of usersWithoutTravelRecords) {
            userData.push({
                fullName: user.fullName,
                route: getRouteNameFromCode(user.route),
                userArrivalCount: 0,
                userDepartureCount: 0,
                numOfDays: 0,
                userUtilizationEfficiency: "0%"
            })
        }
    }

    return {userData, numOfWorkingDays: travelRecords.numOfWorkingDays}
}

export const getHolidayDates = async (req, res) => {

    try {
        const holidays = await Holiday.getHolidays()
        if (holidays && holidays.length > 0) {
            return res.status(200).json({holidays})
        } else {
            return res.status(200).json({message: "No holidays found"})
        }
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

export const saveHolidayDates = async (req, res) => {

    try {
        if (req.body) {
            const holidays = await Holiday.saveHolidays(req.body)
            if (holidays && holidays.length > 0) {
                return res.status(200).json({holidays})
            } else {
                return res.status(200).json({message: "Passed-in dates are already in the list of holidays"})
            }
        }
        return res.status(400).json({error: "Error in saving holiday dates"})
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

export const deleteHolidayDates = async (req, res) => {

    try {
        const id = req.params.id;
        if (id) {
            const deletedHoliday = await Holiday.deleteHoliday(id)
            if (deletedHoliday) {
                return res.status(200).json({message: "Holiday deleted successfully"})
            } else {
                return res.status(200).json({message: "Passed-in date is not in the list of holidays"})
            }
        }
        return res.status(400).json({error: "Error in deleting holiday dates"})
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

export const getDayCountForUser = async (req, res) => {

    const {fromDate, toDate} = req.body;
    try {
        let dayCount;
        if (!fromDate || !toDate) {
            return res.status(400).json({error: "No adequate information in the payload"})
        }

        const userId = await getLoggedInUserId(req);
        dayCount = await getDayCountForGivenDates(fromDate, toDate, userId);
        return res.status(200).json(dayCount);
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
};

export const getDayCountForGivenDates = async (fromDate, toDate, userId) => {

    if (!isTimeStampValid(fromDate) || !isTimeStampValid(toDate)) {
        throw new Error("Invalid Time Stamp");
    }

    let travelRecords = await Travel.getTravelRecordsForUser(fromDate, toDate, userId);
    if (!travelRecords || travelRecords.length === 0) {
        throw new Error('No records found for the given date range')
    }

    let dayCount = {arrivalCount: 0, departureCount: 0, numOfDays: 0}
    let arrivalCount, departureCount, numOfDays
    arrivalCount = departureCount = numOfDays = 0;
    for (const record of travelRecords) {
        if (record.status === TRAVEL_STATUS.MORNING) {
            arrivalCount++;
            numOfDays++;
        }
        if (record.status === TRAVEL_STATUS.EVENING) {
            departureCount++;
            numOfDays++;
        }
        if (record.status === TRAVEL_STATUS.BOTH) {
            arrivalCount++;
            departureCount++;
            numOfDays++;
        }
    }

    dayCount = {arrivalCount, departureCount, numOfDays}
    return dayCount
}
