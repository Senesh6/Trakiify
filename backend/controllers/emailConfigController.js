import EmailConfig from "../models/emailConfigModel.js";
import {getLoggedInUser} from "../util/utils.js";

export const getEmailConfigurations = async (req, res) => {

    const admin = await getLoggedInUser(req);
    if (!admin) {
        return res.status(400).json({error: "Only admin users can access email configurations"})
    }

    let emailConfigs = null
    try {
        emailConfigs = await EmailConfig.getEmailConfigurations();
        if (emailConfigs) {
            return res.status(200).json([...emailConfigs]);
        }
        return res.status(400).json({error: "No email configs found"})
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
};

export const createEmailConfig = async (req, res) => {

    const admin = await getLoggedInUser(req);
    if (!admin) {
        return res.status(400).json({error: "Only admin users can create email configurations"})
    }

    const {code, title, subject, content} = req.body;
    try {
        const emailConfig = await EmailConfig.createEmailConfig(
            code,
            title,
            subject,
            content
        );
        res.status(200).json({
            code: emailConfig.code,
            title: emailConfig.title,
            subject: emailConfig.subject,
            content: emailConfig.content
        });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

export const updateEmailConfig = async (req, res) => {

    const admin = await getLoggedInUser(req);
    if (!admin) {
        return res.status(400).json({error: "Only admin users can update email configurations"})
    }

    const code = req.params.code;
    const {title, subject, content} = req.body;
    try {
        const emailConfig = await EmailConfig.updateEmailConfig(
            code,
            title,
            subject,
            content
        );
        res.status(200).json({
            code: emailConfig.code,
            title: emailConfig.title,
            subject: emailConfig.subject,
            content: emailConfig.content
        });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};
