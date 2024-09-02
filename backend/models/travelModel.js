import mongoose from "mongoose";
import {isTimeStampValid} from "../util/utils.js";
import {TRAVEL_STATUS} from "../constants/constants.js";

const Schema = mongoose.Schema;
const travelSchema = new Schema(
    {
        date: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
    },
    {timestamps: true}
);

travelSchema.statics.updateTravelStatus = async function (date, status, user) {

    if (!date || !status || !user) {
        throw Error("All fields must be filled");
    }
    if (!isTimeStampValid(date)) {
        throw Error("Invalid Time Stamp");
    }

    // Validating travel status
    const validTravelStatuses = [TRAVEL_STATUS.MORNING, TRAVEL_STATUS.EVENING, TRAVEL_STATUS.BOTH, TRAVEL_STATUS.NONE];
    if (!validTravelStatuses.includes(status)) {
        throw Error("Invalid Travel Status");
    }

    // Find the existing travel record by date and user
    let existingTravel = await this.findOne({date, userId: user._id});

    if (!existingTravel) {
        // If no existing record is found, create a new record
        existingTravel = await this.create({
            date: date,
            status: status,
            userId: user._id,
        });
    } else {
        if (status === TRAVEL_STATUS.NONE) {
            // If an existing record is found and status is NONE, delete the record
            await existingTravel.deleteOne()
        } else {
            // If an existing record is found, update the status of that record
            existingTravel.status = status;
            await existingTravel.save();
        }
    }

    return existingTravel;
};

travelSchema.statics.getTravelRecords = async function (fromDate, toDate) {

    if (!fromDate || !toDate) {
        throw Error("All fields must be filled");
    }

    const travelRecords = await this.find({
        date: {$gte: fromDate, $lte: toDate},
    });

    return travelRecords.map(record => {
        let {_id, date, status, userId} = record
        return {_id, date, status, userId}
    });

};

travelSchema.statics.getTravelRecordsForUser = async function (fromTimestamp, toTimestamp, userId) {

    if (!fromTimestamp || !toTimestamp || !userId) {
        throw Error("All fields must be filled");
    }

    const travelRecords = await this.find({
        date: {$gte: fromTimestamp, $lte: toTimestamp},
        userId: userId
    });

    return travelRecords.map(record => {
        let {_id, date, status} = record
        return {_id, date, status}
    });
};

const Travel = mongoose.model("Travel", travelSchema);

export default Travel
