import stationRepo from "../repositories/stationRepository.js";
import { getSocketManager } from "../socket/index.js";

class StationService {
    async addStation(data) {
        if (!data.city || !data.address || !data.latitude || !data.longitude) {
            throw new Error("Missing required station fields");
        }
        const socketManager = getSocketManager();
        const newStation = await stationRepo.create(data);
        socketManager.broadcastStationCreated(newStation);
        return newStation
    }

    async updateStation(id, restData) {
        if (!id || !restData) {
            throw new Error("Station name and update data required");
        }
        // Merge array of objects into one object
        const updates = restData.reduce((acc, item) => ({ ...acc, ...item }), {});
        const updatedStation = await stationRepo.updateById(id, updates);
        const socketManager = getSocketManager();
        await socketManager.broadcastStationUpdated(updatedStation);
        return updatedStation;
    }
    async getAllStationsUser() {
        return await stationRepo.findAll();
    }
    async getAllStations() {
        const stations = await stationRepo.findAll();
        return stations.map(station => ({
            name: station.name,
            latitude: station.latitude,
            longitude: station.longitude,
            status: null
        }))
    };
    async deleteStation(id) {
        // check if station exists
        const existing = await stationRepo.findById(id);
        if (!existing) {
            throw new Error("Station not found");
        }
        const socketManager = getSocketManager();
        socketManager.broadcastStationDeleted(existing.id.toString());
        await stationRepo.deleteById(id);
        return { message: "Station deleted" };
    }
    async getFilteredStations(filters) {
        return await stationRepo.findStations(filters);
    }
}

export default new StationService(); // ✅ class instance
