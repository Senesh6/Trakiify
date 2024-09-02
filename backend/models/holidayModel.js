import mongoose from "mongoose";
import {isTimeStampValid} from "../util/utils.js";

const Schema = mongoose.Schema

const holidaySchema = new Schema(
    {
        date: {
            type: String,
            required: true,
            unique: true
        },
    },
    {timestamps: true}
)

holidaySchema.statics.saveHolidays = async function (dates) {

    if (!dates || !Array.isArray(dates) || dates.length === 0) {
        throw new Error('Dates array is invalid or empty');
    }

    // Validate each date and convert it to a holiday object
    const holidays = [];
    const existingHolidays = new Set();
    for (const date of dates) {
        if (!isTimeStampValid(date)) {
            throw new Error(`Invalid date format: ${date}`);
        }

        // Check if the holiday already exists in the database
        const existingHoliday = await this.findOne({date: date});
        if (existingHoliday) {
            existingHolidays.add(date);
        } else {
            holidays.push({date: date});
        }
    }

    let newHolidays = null
    // Insert the holiday objects into the database
    if (holidays.length > 0) {
        newHolidays = await this.insertMany(holidays, {ordered: false});
    }

    // Return the inserted holidays
    return newHolidays?.map(holiday => {
        const {_id, date} = holiday
        return {_id, date}
    })
};

holidaySchema.statics.getHolidaysForDateRange = async function (fromDate, toDate) {

    if (!fromDate || !toDate) {
        throw Error("All fields must be filled");
    }

    const holidayRecords = await this.find({
        date: {$gte: fromDate, $lte: toDate},
    });

    return holidayRecords.map(record => {
        let {_id, date} = record
        return {_id, date}
    });

};

holidaySchema.statics.getHolidays = async function () {

    const holidayRecords = await this.find();

    return holidayRecords.map(record => {
        let {_id, date} = record
        return {_id, date}
    });

};

holidaySchema.statics.deleteHoliday = async function (id) {

    if (!id) {
        throw Error("All fields must be filled");
    }

    const deletedHoliday = await this.deleteOne({_id: id});
    return deletedHoliday

};

const Holiday = mongoose.model('Holiday', holidaySchema);

export default Holiday
