import nodemailer from 'nodemailer';
import env from "dotenv";
import {EMAIL_CONFIG} from "../enums.js";
import EmailConfig from "../models/emailConfigModel.js";
import cron from "node-cron";
import {getLessEfficientUsers} from "./utils.js";
import {EMAIL_BEST_REGARDS, EMAIL_GREETING} from "../constants/constants.js";
import UserModel from "../models/userModel.js";

env.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Mail Server is up and running");
    }
});


/**
 * This cron job will be run on the 1st day of every month
 * This will email all the users and warn them that they earlier month's dates will be disabled on 5th day of the month
 */
cron.schedule('0 0 1 * *', async () => {
    try {
        // Get the email address list of the users
        const users = await UserModel.getUserEmailList();

        // Get the email configuration regarding disabling the last month's calendars
        const emailConfig = await EmailConfig.getConfigByCode(EMAIL_CONFIG.LAST_MONTH_DISABLING_WARNING_EMAIL);

        for (const user of users) {

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: emailConfig.subject,
                text: `${EMAIL_GREETING} ${user.fullName},\n\n${emailConfig.content}\n\n${EMAIL_BEST_REGARDS}`,
            };

            const info = await transporter.sendMail(mailOptions);
            console.log(`Last month disabling email sent successfully to ${user.fullName} - ${info.response}`);
        }
    } catch (error) {
        console.error('Error sending emails:', error);
    }
});

/**
 * This cron job will be run on the 15th day of every month (Starting of the 3rd week)
 * This will check the utilization efficiency of the user and if it is below 30%, it will email the user to update the records
 */
cron.schedule('0 0 15 * *', async () => {

    try {
        //Get emails of the users with less utilization efficiency
        const lessEfficientUsers = await getLessEfficientUsers();

        // Get the email configuration from the collection
        const emailConfig = await EmailConfig.getConfigByCode(EMAIL_CONFIG.UPDATE_SYSTEM_REMINDER_EMAIL);

        // Send the emails
        for (const user of lessEfficientUsers) {

            const user = {email: ""}
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: emailConfig.subject,
                text: `${EMAIL_GREETING} ${user.fullName},\n\n${emailConfig.content}\n\n${EMAIL_BEST_REGARDS}`,
            };

            const info = await transporter.sendMail(mailOptions);
            console.log(`Update system reminder email sent successfully to ${user.fullName} - ${info.response}`);
        }

    } catch (error) {
        console.error('Error sending second emails:', error);
    }

});
