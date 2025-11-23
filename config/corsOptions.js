export const corsOptions = {
    origin: ["http://localhost:5173", "https://your-frontend.com"], // allowed frontends
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Password"],
    credentials: true, // if you use cookies or Authorization headers
    maxAge: 3600,
};