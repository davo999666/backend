import {userRepository} from "../repositories/userRepository.js";
import { sendEmail } from "../utils/sendEmail.js";
import {createHash} from "../utils/createHash.js";
import {User} from "../models/index.js";
import {createHashToken} from "../utils/createTokenBase.js";
import {cache} from "../cashe/cashe.js";


class UserService {
    async login({ login, password }) {
        let user = await User.scope("withPassword").findByPk(login);
        if (!user) throw new Error("Invalid login");
        const valid = await user.validatePassword(password);
        if (!valid) throw new Error("Invalid password");
        const foundUser = await userRepository.findByLogin(login);
        const tokenHase = await createHashToken(foundUser.role);
        return {tokenHase, foundUser};
    }
    async register(user) {
        const hash = await createHash(user.password);
        delete user.password;
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        const data = {...user, password_hash: hash, code};
        cache.set(`pending:${user.email}`, data);
        await sendEmail("verify", user.email, { code });
        return { message: "Verification code sent to email" };
    }

    async verify({email, code , newPassword=null}) {
        const data = cache.get(`pending:${email}`);
        if (!data) throw new Error("Verification expired or not found");
        if (data.code !== code) {
            throw new Error("Invalid code");
        }
        delete data.code;
        let user;
        if(Object.keys(data).length > 0){
            user = await userRepository.register(data);
        }
        else {
            user = await userRepository.findByEmail(email);
            await userRepository.resetPassword(user, newPassword)
        }
        // delete from cache (optional, TTL auto-expires anyway)
        cache.del(`pending:${email}`);
        return { message: "User verified", user };
    }

    async resetPassword(login, currentPassword, newPassword) {
        const user = await User.scope("withPassword").findByPk(login);
        if (!user) throw new Error("User not found");
        const valid = await user.validatePassword(currentPassword);
        if (!valid) throw new Error("Current password is incorrect");
        return userRepository.resetPassword(user, newPassword);
    }
    async forgotPassword (email) {
        const user = await userRepository.findByEmail(email);
        if (!user) throw new Error("User not found");
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        cache.set(`pending:${user.email}`, {code});
        await sendEmail("verify", user.email, { code });
        return { message: "Verification code sent to email" };
    }

    async sendMessage(senderId, receiverId, text) {
        if (!text.trim()) {
            throw new Error("Message cannot be empty");
        }
        return userRepository.addMessage(senderId, receiverId, text);
    }



}

export const userService = new UserService();
