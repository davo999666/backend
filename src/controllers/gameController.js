import gameServices from "../services/gameServices.js";

class GameController {
    async getSentences(req, res, next) {
        try {
            const { level, know, learn } = req.query;
            const sentences = await gameServices.getSentences({level, know, learn});
            res.status(200).send(sentences);
        }catch (err) {
            res.status(404).send(err);
            next(err)
        }
    }
}


export default new GameController();