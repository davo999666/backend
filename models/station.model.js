import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

const Station = sequelize.define("Station", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    address: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM("fast", "slow"),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("available", "busy"),
        defaultValue: "available"
    },
    energy_kwh: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    price_per_kwh: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    fullData: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
    },
}, {
    tableName: "stations",
    underscored: true,
    timestamps: true,
});

export default Station;
