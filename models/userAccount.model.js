import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import {createHash} from "../utils/createHash.js";


const User = sequelize.define(
    "User",
    {
        login: {
            type: DataTypes.STRING(50),
            primaryKey: true,
        },
        fullName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        password_hash: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("user", "admin", "charging"),
            defaultValue: "user",
            allowNull: false,
        },
    },
    {
        tableName: "users",
        underscored: true,
        timestamps: true,
        defaultScope: {
            attributes: { exclude: ["password_hash"] }, // hide by default
        },
        scopes: {
            withPassword: {
                attributes: {}, // include all fields
            },
        },
    }
);

// 👇 Add instance method for password validation
User.prototype.validatePassword = async function (password) {
    if (!password) throw new Error("Password is required");
    if (!this.password_hash) {
        throw new Error("Password hash is missing. Did you load it with scope('withPassword')?");
    }
    return await bcrypt.compare(password, this.password_hash);
};

// 👇 Safety net: remove hash when converting to JSON
User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password_hash;
    return values;
};
User.prototype.setPassword = async function (newPassword) {
    if (!newPassword) {
        throw new Error("Password is required");
    }
    const hash = await createHash(newPassword)
    this.setDataValue("password_hash", hash); // save hash as string
};

export default User;
