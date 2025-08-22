import express from "express";
import cors from 'cors';
import mongoose from "mongoose";
import config from "./config/config.js";
import userRoutes from "./routes/user.routes.js";
import gameRoutes from "./routes/game.routes.js";
import {corsOptions} from "./config/corsOptions.js";
import errorHandler from "./middleware/error.middleware.js";



const app = express()
app.use(cors(corsOptions));
app.use(express.json());
app.use('/', userRoutes);
app.use('/games', gameRoutes);
app.use(errorHandler);

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongodb.uri, config.mongodb.db);
        console.log("Connected DB successfully.");
    }catch(err) {
        console.error("MongoDB connection error:", err);
    }
}

const startServer = async () => {
    await connectDB();
    app.listen(config.port,()=>{
        console.log("Server running on port", config.port);
    })
};

startServer()