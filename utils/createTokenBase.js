import crypto from "crypto";

export async function  createHashToken(role) {
    return crypto.createHash("sha256").update(role).digest("hex");
}


// const adminHash = createRoleHash("admin");
// const userHash  = createRoleHash("user");
//
// console.log("Admin:", adminHash);
// console.log("User:", userHash);