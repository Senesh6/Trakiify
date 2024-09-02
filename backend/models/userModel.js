import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const Schema = mongoose.Schema
const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    team: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    route: {
        type: String,
        required: true
    }
}, {timestamps: true})

userSchema.statics.login = async function (email, password) {

    if (!email || !password) {
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({email})
    if (!user) {
        throw Error('Incorrect email')
    }

    const passwordsMatch = await bcrypt.compare(password, user.password)
    if (!passwordsMatch) {
        throw Error('Incorrect password')
    }

    return user
}

userSchema.statics.signup = async function (fullName, email, password, team, route) {

    //Validations
    if (!fullName || !email || !password || !team || !route) {
        throw Error('All fields must be filled')
    }

    if (!validator.isEmail(email)) {
        throw Error('Email is not valid')
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough')
    }

    const userExistsForEmail = await this.findOne({email})
    if (userExistsForEmail) {
        throw Error('Email is already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({fullName, email, password: hash, team, route})
    return user
}

userSchema.statics.getAllUsers = async function () {
    // Use the 'find' method to retrieve all users, including the '_id' field
    return await this.find({}, '_id fullName team email route');
};

userSchema.statics.getUserIds = async function () {

    // Use the 'find' method to retrieve all users and only select the '_id' field
    const users = await this.find({}, '_id');

    // Extract the user ids into an array
    return users.map(user => user._id);
};

const User = mongoose.model('User', userSchema)

export default User
