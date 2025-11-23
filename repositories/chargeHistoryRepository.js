import {ChargeHistory, Station, User} from "../models/index.js";

class ChargeHistoryRepository {
    async create(startData) {
        return ChargeHistory.create(startData);
    }

    async findActiveByUserAndStation(login, station_id) {
        return await ChargeHistory.findOne({
            include: [
                {
                    model: User,
                    where: { login },
                }
            ],
            where: { station_id, end_time: null }
        });
    }

    async update(history) {
        return await history.save();
    }

    // chargeHistoryRepository.js
    async findByUserAndStation(user_id, station_id) {
        return await ChargeHistory.findAll({
            where: { user_id, station_id },
            include: [User, Station],
        });
    }


    async findByStation(station_id) {
        return await ChargeHistory.findAll({
            where: { station_id },
            include: [User],
            order: [["start_time", "DESC"]],
        });
    }
}

export default new ChargeHistoryRepository();
