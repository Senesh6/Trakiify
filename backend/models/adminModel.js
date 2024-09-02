import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema
const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: false
    }
}, {timestamps: true})

adminSchema.statics.login = async function (email, password) {

    if (!email || !password) {
        throw Error('All fields must be filled')
    }

    const admin = await this.findOne({email})
    if (!admin) {
        return null
    }

    const passwordsMatch = await bcrypt.compare(password, admin.password)
    if (!passwordsMatch) {
        throw Error('Incorrect password')
    }

    return admin
}

const Admin = mongoose.model('Admin', adminSchema)

export default Admin;
