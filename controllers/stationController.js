import stationService from "../services/stationService.js";

class StationController {

    async addStation(req, res, next) {
        try {
            const station = await stationService.addStation(req.body);
            res.status(201).json(station);
        } catch (err) {
            next(err);
        }
    }

    async updateStation(req, res, next) {
        try {
            const { id } = req.params;
            const { restData } = req.body;
            const station = await stationService.updateStation(id, restData);
            if (!station) {
                return res.status(404).json({ message: "Station not found" });
            }

            res.json(station);
        } catch (err) {
            next(err);
        }
    }

    async getAllStations(req, res, next) {
        try {
            if (req.principal) {
                const success = await stationService.getAllStationsUser(req, res, next);
                res.cookie("authData", JSON.stringify({ token: "hello" }), {
                    httpOnly: false,     // frontend can read
                    secure: false,       // ❗ must be FALSE on localhost (no HTTPS)
                    sameSite: "lax",     // ✅ works for same origin and localhost
                    path: "/"            // ✅ cookie used on all routes
                });

                res.status(200).json(success);
            } else {
                const success = await stationService.getAllStations(req, res, next);
                res.status(200).json(success);
            }
        } catch (err) {
            console.log(err)
            next(err);
        }
    };
    async deleteStation(req, res) {
        try {
            const { id } = req.params;
            const result = await stationService.deleteStation(id);
            return res.status(200).json(result);
        } catch (err) {
            if (err.message === "Station not found") {
                return res.status(404).json({ message: err.message });
            }
            console.error("Delete Station Error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    };
    async getFilteredStations(req, res) {
        try {
            const { city, status, type } = req.query;
            const filters = {
                city,
                status,                      // "available" / "not"
                types: type ? type.split(",") : [], // supports "fast,slow"
            };
            console.log(filters)
            const stations = await stationService.getFilteredStations(filters);
            res.json(stations);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }
}

export default new StationController();
