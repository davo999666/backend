import stationRepository from "../repositories/stationRepository.js";

class SocketManager {
    constructor(io) {
        this.io = io;
        this.initialize();
    }

    initialize() {
        this.io.on("connection", (socket) => {
            console.log("✅ User connected:", socket.id);

            this.registerStationHandlers(socket);

            socket.on("disconnect", () => {
                console.log("❌ User disconnected:", socket.id);
            });
        });
    }

    registerStationHandlers(socket) {
        // Send stations on request
        socket.on("getStations", async (token) => {
            const allStations = await stationRepository.findAll();
            const stationsToSend = this.prepareStationsResponse(allStations, token);

            socket.emit("stations", stationsToSend);
            console.log(`📤 Sent ${stationsToSend.length} stations`);
        });

        // Optional: full refresh
        socket.on("refreshStations", async () => {
            const allStations = await stationRepository.findAll();
            this.io.emit("stations", allStations);
            console.log(`📤 Broadcasted ${allStations.length} stations to all clients`);
        });
    }

    // Incremental updates for all clients
    broadcastStationCreated(station) {
        this.io.emit("stationCreated", station);
    }

    broadcastStationUpdated(station) {
        this.io.emit("stationUpdated", station);
    }

    broadcastStationDeleted(stationId) {
        this.io.emit("stationDeleted", stationId);
    }

    prepareStationsResponse(stations, token) {
        if (token) return stations;
        return stations.map((s) => ({
            id: s.id,
            latitude: s.latitude,
            longitude: s.longitude,
            status: null,
        }));
    }
}

// ✅ Global instance
let socketManagerInstance = null;

// Initialize SocketManager and return the instance
export function initSocket(io) {
    if (!socketManagerInstance) {
        socketManagerInstance = new SocketManager(io);
    }
    return socketManagerInstance;
}

// Get the initialized instance elsewhere
export function getSocketManager() {
    if (!socketManagerInstance) throw new Error("SocketManager not initialized");
    return socketManagerInstance;
}
