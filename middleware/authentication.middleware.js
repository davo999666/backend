import User from "../models/userAccount.model.js";

const base64Auth = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Basic ")) {
        return res.status(401).json({ message: "Missing or invalid Authorization header" });
    }

    const base64Credentials = authHeader.split(" ")[1];
    const decoded = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [login, password] = decoded.split(":");

    const user = await User.scope("withPassword").findByPk(login);
    if (!user) {
        return res.status(403).json({ message: "Forbidden: User not found" });
    }

    const isValid = await user.validatePassword(password);

    if (!isValid) {
        return res.status(403).json({ message: "Forbidden: Invalid credentials" });
    }
    req.principal = { login: user.login, role: user.role };

    next();
}

export default base64Auth;
