import chargeHistoryService from "../services/chargeHistoryService.js";

class ChargeHistoryController {
    async start(req, res, next) {
        try {
            const login = req.principal.login
            const { station_id } = req.params;
            const history = await chargeHistoryService.startCharging( login, station_id );
            res.status(201).json(history);
        } catch (err) {
            next(err);
        }
    }

    async stop(req, res, next) {
        try {
            const login = req.principal.login
            const { station_id } = req.params;
            const history = await chargeHistoryService.stopCharging( login, station_id);
            res.json(history);
        } catch (err) {
            next(err);
        }
    }

    async getHistoryUser(req, res, next) {
        try {
            const login = req.principal.login
            const station_id = req.params.station_id;
            if (!login) {
                return res.status(400).json({ message: "login is required" });
            }
            const history = await chargeHistoryService.getByUserAndStation(login, station_id);
            return res.json(history);
        } catch (err) {
            console.error("getHistoryUser error:", err);
            next(err);
        }
    }

    async getHistoryStation(req, res, next) {
        try {
            const { station_id } = req.query;
            if (!station_id) {
                return res.status(400).json({ message: "station_id is required" });
            }
            const history = await chargeHistoryService.getHistoryByStation(station_id);
            return res.json(history);
        } catch (err) {
            console.error("getHistoryStation error:", err);
            next(err);
        }
    }
}

export default new ChargeHistoryController();
