import express from 'express';
import { sequelize } from './config/database.js';
import userRoutes from './routes/userRouter.js';
import stationRoutes from './routes/stationRouter.js';
import chargeHistoryRoutes from './routes/chargeHistoryRoutes.js';
import errorHandler from './middleware/error.middleware.js';
import { initAdmin } from './config/initAdmin.js';
import { corsOptions } from './config/corsOptions.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer as createHttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { initSocket } from './socket/index.js';

export function createServer() {
    const app = express();

    app.use(express.json());
    app.use(cors(corsOptions));
    app.use(cookieParser());

    // HTTP server required for Socket.io
    const server = createHttpServer(app);

    // Initialize Socket.io
    const io = new SocketIOServer(server, {
        cors: {
            origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
            credentials: true,
        },
        pingInterval: 1000, // ping every second
        pingTimeout: 5000,  // disconnect if no pong in 5s
    });

    // Initialize SocketManager
    initSocket(io);

    // Routes
    app.use('/users', userRoutes);
    app.use('/stations', stationRoutes);
    app.use('/charging', chargeHistoryRoutes);

    // Error handler
    app.use(errorHandler);

    return { app, server }; // return both for testing and starting
}

// Start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
    const port = process.env.PORT || 3000;
    (async () => {
        try {
            await sequelize.authenticate();
            await initAdmin();

            const { app, server } = createServer();
            server.listen(port, () => console.log(`Server running on ${port}`));
        } catch (err) {
            console.error('DB connection error:', err.message);
        }
    })();
}
