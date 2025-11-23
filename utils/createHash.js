import bcrypt from "bcrypt";

export const createHash = async (password) => {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
};
