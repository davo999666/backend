import {Station} from "../models/index.js";
import {Op} from "sequelize";

class StationRepository {
    async create(stationData) {
        return Station.create(stationData);
    }

    async updateById(id, updates) {
        const station = await Station.findByPk(id);
        if (!station) return null;
        await station.update(updates);
        return station;
    }

    async findAll() {
        return await Station.findAll();
    }

    async findById(id) {
        return await Station.findByPk(id);
    }
    async deleteById(id) {
        return await Station.destroy({ where: { id } });
    }
    async findStations(filters) {
        const where = {};
        if (filters.city) where.city = { [Op.iLike]: `%${filters.city}%` };
        if (filters.status) {where.status = filters.status;}// "available" or "not"
        if (filters.types && filters.types.length > 0) {where.type = { [Op.in]: filters.types };}// type IN ("fast", "slow")

        return await Station.findAll({ where });
    }
}

export default new StationRepository();
