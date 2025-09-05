export const corsOptions = {
    origin: process.env.CORS_ORIGIN || "*", // frontend URL or all origins
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Password'],
    credentials: true, // allow cookies
    maxAge: 3600, // seconds
};