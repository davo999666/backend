import dotenv from 'dotenv';

dotenv.config();


const config = {
        port: process.env.PORT || 3000,
        mongodb: {
            uri: process.env.MONGODB_URI

            ,
            db: {
                dbName: process.env.DB_NAME,
            }
    },
}
console.log("PORT from env:", process.env.PORT);
console.log("Using port:", config.port);
export default config