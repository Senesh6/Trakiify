import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";
import {USER_ROLES} from "../constants/constants.js";
import {createJwtToken} from "../util/utils.js";

export const login = async (req, res) => {

    let adminOrUser = null;
    const {email, password} = req.body
    try {
        let role = USER_ROLES.ADMIN
        adminOrUser = await Admin.login(email, password)
        if (!adminOrUser) {
            role = USER_ROLES.USER
            adminOrUser = await User.login(email, password)
        }

        const {token} = await getTokenAndExpiryDate(adminOrUser, role)
        res.status(200).json({token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }

}

export const signup = async (req, res) => {

    const {fullName, email, password, team, route} = req.body
    try {
        const user = await User.signup(fullName, email, password, team, route)

        const {token} = await getTokenAndExpiryDate(user, USER_ROLES.USER)
        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const getTokenAndExpiryDate = async (user, role) => {
    const token = await createJwtToken(user._id, role, user.fullName)
    return {token}
}
