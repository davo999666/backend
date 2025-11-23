// middlewares/optionalBasicAuth.js
import { User } from "../models/index.js";

export async function optionalBasicAuth(req, res, next) {
    const auth = req.headers.authorization;
    // 1. No header → guest
    if (!auth) {
        req.user = null;
        return next();
    }
    // 2. Check if it's Basic
    if (!auth.startsWith("Basic ")) {
        req.user = null;
        return next();
    }
    try {
        // 3. Decode Base64 "username:password"
        const base64Credentials = auth.split(" ")[1];
        const decoded = Buffer.from(base64Credentials, "base64").toString("utf8");
        const [login, password] = decoded.split(":");

        // 4. Validate against DB
        const user = await User.scope("withPassword").findByPk(login);

        if (user && await user.validatePassword(password)) {
            req.principal = { login: user.login, role: user.role };
        } else {
            req.user = null; // invalid credentials → guest
        }
    } catch (err) {
        console.error("Auth error:", err);
        req.user = null;
    }
    next();
}
