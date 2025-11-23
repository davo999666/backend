import stationRepo from "../repositories/stationRepository.js";

class StationService {
    async addStation(data) {
        if (!data.city || !data.address || !data.latitude || !data.longitude) {
            throw new Error("Missing required station fields");
        }
        return stationRepo.create(data);
    }

    async updateStation(id, restData) {
        if (!id || !restData) {
            throw new Error("Station name and update data required");
        }
        // Merge array of objects into one object
        const updates = restData.reduce((acc, item) => ({ ...acc, ...item }), {});
        return await stationRepo.updateById(id, updates);
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

        await stationRepo.deleteById(id);
        return { message: "Station deleted" };
    }
    async getFilteredStations(filters) {
        return await stationRepo.findStations(filters);
    }
}

export default new StationService(); // ✅ class instance
