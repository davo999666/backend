export const corsOptions = {
    origin: "*",
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Password'],
    credentials: true, // allow cookies
    maxAge: 3600, // seconds
};