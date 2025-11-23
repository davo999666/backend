import {User} from "../models/index.js";


class UserRepository {
    async register(user) {
        return User.create(user);
    }
    async findByLogin(login) {
        return await User.findByPk(login);
    }
    async resetPassword(user, newPassword) {
        await user.setPassword(newPassword);
        await user.save();
        return user;
    }
    async updateUserRole(login, newRole) {
        const user = await User.findByPk(login);
        if (!user) throw new Error("User not found");
        user.role = newRole;
        await user.save();
        return user;
    }
    async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }

}

export const userRepository = new UserRepository();
