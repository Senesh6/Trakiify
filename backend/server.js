import express from "express";
import cors from "cors"
import mongoose from "mongoose";
import env from "dotenv"
import travelRoutes from "./routes/travelRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import emailConfigRoutes from "./routes/emailConfigRoutes.js";
import "./util/emailService.js"
import morgan from "morgan";

//Config environment
env.config()

const app = express()
const PORT = process.env.PORT || 3500

// Enable CORS support
app.use(cors())

// Parse JSON data
app.use(express.json())
app.use(express.urlencoded({extended: true}));

// Create a custom token for Morgan to log request and response bodies
morgan.token('body', (req) => {
    return JSON.stringify(req.body);
});

// Define a custom format for Morgan to include request and response bodies
const customMorganFormat = ':method :url :status :response-time ms - :res[content-length] - Request Body: :body';

// Enable logging based on the environment using the custom format
if (process.env.NODE_ENV === 'production') {
    app.use(morgan(customMorganFormat));
} else {
    app.use(morgan(customMorganFormat));
}

app.use('/api/user', userRoutes)
app.use('/api/travel', travelRoutes)
app.use('/api/email', emailConfigRoutes)

// Define a simple "Hello, World!" endpoint
app.get('/hello', (req, res) => {
    res.send('Hello, World!');
});

//Connect to DB and Server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to the database')
        app.listen(process.env.PORT, () => {
            console.log(`Express Server running on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.error(err)
    })

export default app