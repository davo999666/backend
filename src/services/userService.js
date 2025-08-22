import userRepository from '../repositories/userRepository.js';
import jwt from 'jsonwebtoken';
import {sendVerificationEmail} from "./emailSerivices.js";
const tempUsers = new Map();

class UserService {
    async login(data) {
        const success = await userRepository.login(data);
        if (success) {
            const {login} = data;
            const token = await jwt.sign({login}, process.env.SECRET_KEY, {expiresIn: '30d'})
            const user = success
            return {token, user}
        }
        return false;
    }
     async  verifyEmil(data) {
        const existingUser = await userRepository.findUser(data);
        if (existingUser) {
            throw new Error('User already exists');
        }
         const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
        await sendVerificationEmail(data.email, verificationCode);
         tempUsers.set(data.email, { data, code: verificationCode });
         return { message: "Verification code sent" };

    }
    async register(data){
        const { email, code} = data;
        const temp = tempUsers.get(email);
        if (!temp) {
            tempUsers.delete(email);
            throw new Error("No verification found for this email");
        }
        if (temp.code !== code) {
            tempUsers.delete(email);
            throw new Error("Invalid verification code");
        }
        await userRepository.createUser(temp.data);
        tempUsers.delete(email);
        const token = await jwt.sign({ login: temp.data.login }, process.env.SECRET_KEY, { expiresIn: '30d' });
        const user = await temp.data;
        return {token, user}
    }
}


export default new UserService();