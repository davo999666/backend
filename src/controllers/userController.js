import userService from '../services/userService.js';

class UserController {
    async login (req, res, next) {
        try {
            const user = await userService.login(req.body);
            res.status(200).send(user);
        }catch(err) {
            res.status(404).json(err)
            next(err)
        }
    }
    async verifyEmil (req, res, next) {
        try {
            const success = await userService.verifyEmil(req.body)
            res.status(200).json(success)
        }catch (err) {
            res.status(404).json(err)
            next(err)
        }
    }
    async register(req, res, next) {
        try {
            const success = await userService.register(req.body);
            res.status(200).send(success)
        }catch (err){
            res.status(404).json(err)
            next(err)
        }
    }
}


export default new UserController()