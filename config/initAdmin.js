import {User} from "../models/index.js"; // adjust path

export async function initAdmin() {
    let admin = await User.scope("withPassword").findByPk("admin");

    if (!admin) {
        admin = User.build({
            login: "admin",
            fullName: "System Administrator",
            email: "davoaleks1991@gmail.com",
            phone: "0000000000",
            role: "admin",
        });

        // set a secure password
        await admin.setPassword(process.env.ADMIN_PASSWORD);

        await admin.save();

        console.log("✅ Admin user created");
    } else {
        console.log("ℹ️ Admin already exists");
    }
}
