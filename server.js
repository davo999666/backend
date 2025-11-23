import express from 'express';
import { sequelize } from './config/database.js';
import userRoutes from './routes/userRouter.js';
import errorHandler from './middleware/error.middleware.js';
import stationRoutes from './routes/stationRouter.js';
import chargeHistoryRoutes from './routes/chargeHistoryRoutes.js';
import { initAdmin } from './config/initAdmin.js';
import { corsOptions } from './config/corsOptions.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { initSocket } from './socket.js';

export function createServer() {
    const app = express();
    app.use(express.json());
    app.use(cors(corsOptions));
    app.use(cookieParser());
    initSocket(http.createServer(app)); // attach sockets

    app.use('/users', userRoutes);
    app.use('/stations', stationRoutes);
    app.use('/charging', chargeHistoryRoutes);
    app.use(errorHandler);

    return app; // just return the app for testing
}

// Only start server when running directly
if (process.env.NODE_ENV !== 'test') {
    const port = process.env.PORT || 3000;
    (async () => {
        try {
            await sequelize.authenticate();
            await initAdmin();
            const app = createServer();
            app.listen(port, () => console.log(`Server running on ${port}`));
        } catch (err) {
            console.error('DB connection error:', err.message);
        }
    })();
}
