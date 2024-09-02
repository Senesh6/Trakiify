import mongoose from "mongoose";
import {EMAIL_CONFIG_CODES} from "../enums.js";

const Schema = mongoose.Schema
const emailConfigSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    subject: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, {timestamps: true})

emailConfigSchema.statics.getConfigByCode = async function (code) {

    if (!code) {
        throw Error(`Unable to find email config - ${code}`)
    }

    const config = await this.findOne({code})
    if (!config) {
        throw Error('Email config not found')
    }

    return config
}

emailConfigSchema.statics.createEmailConfig = async function (code, title, subject, content) {

    // Validate required fields
    if (!code || !title || !subject || !content) {
        throw Error("Please fill all required details");
    }

    // Validate email config code
    if (!EMAIL_CONFIG_CODES.includes(code)) {
        throw Error(`Invalid email configuration - ${code}`);
    }

    // Create new email config
    const emailConfig = await this.create({
        code: code,
        title: title,
        subject: subject,
        content: content
    });

    return emailConfig;
};

emailConfigSchema.statics.updateEmailConfig = async function (code, title, subject, content) {

    if (!code) {
        throw Error("Email config code not found");
    }

    //Find the email config for the given code
    let existingEmailConfig = await this.findOne({code});
    if (!existingEmailConfig) {
        throw Error(`Email config not found for code - ${code}`);
    }

    existingEmailConfig.title = title;
    existingEmailConfig.subject = subject;
    existingEmailConfig.content = content;
    await existingEmailConfig.save();

    return existingEmailConfig;
};

emailConfigSchema.statics.getEmailConfigurations = async function () {

    const emailConfigs = await this.find({})

    return emailConfigs.map(config => {
        let {code, title, subject, content} = config
        return {code, title, subject, content}
    });

};

const EmailConfig = mongoose.model('EmailConfig', emailConfigSchema)

export default EmailConfig;
