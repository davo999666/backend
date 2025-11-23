import User from "./userAccount.model.js";
import Station from "./station.model.js";
import ChargeHistory from "./chargeHistory.model.js";
import { sequelize } from "../config/database.js";

// Associations
User.hasMany(ChargeHistory, { foreignKey: "user_id" });
ChargeHistory.belongsTo(User, { foreignKey: "user_id" });

Station.hasMany(ChargeHistory, { foreignKey: "station_id" });
ChargeHistory.belongsTo(Station, { foreignKey: "station_id" });


export const syncModels = async () => {
    try {
        await sequelize.sync({ alter: true });
    } catch (e) {
        console.error("❌ Unable to sync models:", e);
    }
};

export { sequelize, User, Station, ChargeHistory, };
