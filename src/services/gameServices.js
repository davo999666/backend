import gameRepository from "../repositories/gameRepository.js";

class GameService {
    async getSentences(data) {
        const { level, know, learn } = data;
        const sentences = await gameRepository.getSentences(level);
        if (sentences) {
            return sentences.reduce((acc, item) => {
                if (item[know] && item[learn]) {
                    acc[item[know].replace('', '')] = item[learn];
                }
                return acc;
            }, {});
        }
        return false;
    }

}

export default new GameService();