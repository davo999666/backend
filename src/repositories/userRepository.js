import UserAccount from '../models/userAccount.model.js'

class UserRepository {
    async findUser(data) {
        return UserAccount.findById(data.login);

    }

    async login(user) {
        const userData = await UserAccount.findById(user.login);
        if (!userData) {
            throw new Error("User not found");
        }
        if (user.password === userData.password) {
            return userData
        } else {
            throw new Error("Passwords do not match");
        }
    }

    async  createUser(data) {
        const user = new UserAccount({_id: data.login, ...data});
        return user.save();
    }
}

export default new UserRepository();