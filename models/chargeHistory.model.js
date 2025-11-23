import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

const ChargeHistory = sequelize.define("ChargeHistory", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true },
    start_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW },
    end_time: {
        type: DataTypes.DATE,
        allowNull: true },
    energy_kwh: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true },
}, {
    tableName: "charge_history",
    underscored: true,
    timestamps: true,
});

export default ChargeHistory;
