export const corsOptions = {
    origin: process.env.CORS_ORIGIN || "*", // your React frontend URL
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Password'],
    credentials: true, // allow cookies if backend uses them
    maxAge: 3600,
};