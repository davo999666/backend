import {userService} from "../services/userService.js";


class UserController {
    async verification(req, res, next) {
        try {
            const user = await userService.verify(req.body);
            return res.status(200).json(user);
        }catch(err) {
            console.log(err);
            next(err);
        }
    }
    async login(req, res, next) {
        try {
            const user = await userService.login(req.body);

            return res.status(200).json(user);

        }catch(err) {
            console.log(err);
            next(err);
        }
    }
    async register(req, res, next) {
        try {
            const user = await userService.register(req.body);
            return res.status(200).json(user);
        }catch(err) {
            console.log(err);
            next(err);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            const {email} = req.params;
            const success = await userService.forgotPassword(email);
            return res.status(200).json(success);
        }catch (err){
            console.error("Error resetting password:", err);
            next(err);
        }
    }
    async resetPassword(req, res, next) {
        try {
            const { login }  = req.principal;         // login from URL
            const { newPassword } = req.body;     // new password from body
            // 1. Read Authorization header
            const authHeader = req.headers["authorization"];
            if (!authHeader || !authHeader.startsWith("Basic ")) {
                return res.status(401).json({ message: "Missing Authorization header" });
            }

            // 2. Decode Base64
            const base64Credentials = authHeader.split(" ")[1];
            const decoded = Buffer.from(base64Credentials, "base64").toString("utf-8");
            const [authLogin, currentPassword] = decoded.split(":");

            if (authLogin !== login) {
                return res.status(403).json({ message: "Login mismatch" });
            }

            // 4. Call service
            const user = await userService.resetPassword(login, currentPassword, newPassword);

            return res.status(200).json({
                message: "Password reset successful",
                user,
            });
        } catch (err) {
            console.error("Error resetting password:", err);
            next(err);
        }
    }

}

export const userController =  new UserController();