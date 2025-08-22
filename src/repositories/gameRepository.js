import sentencesModel from "../models/sentences.model.js";

class GameRepository {
    async getSentences(level, limit = 5) {
        return sentencesModel.aggregate([
            { $match: { level: level } },
            { $sample: { size: limit } },
            { $project: { en: '$_id', am: 1, ru: 1, hw: 1 } }
        ]);
    }
}

export default new GameRepository();