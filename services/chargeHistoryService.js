import chargeHistoryRepo from "../repositories/chargeHistoryRepository.js";
import {Station, User} from "../models/index.js";
import {sendEmail} from "../utils/sendEmail.js";
import {formatDate} from "../utils/dateFormat.js";
import stationRepo from "../repositories/stationRepository.js";
import {timePassed} from "../utils/timePassed.js";
import {userRepository} from "../repositories/userRepository.js";
import {createHashToken} from "../utils/createTokenBase.js";
import { getSocketManager } from "../socket/index.js";

class ChargeHistoryService {
    async startCharging(login, station_id) {
        if (!login || !station_id) throw new Error("Login and station_id required");
        const user = await userRepository.updateUserRole(login, "charging");
        const station = await Station.findByPk(station_id);
        if (!user || !user.email) {
            throw new Error("User not found or user has no email");
        }
        const date = formatDate(new Date());
        const updated = await stationRepo.updateById(station.id, { status: 'busy' });
        if (updated) {
            // Reload the station to get updated status
            const updatedStation = await Station.findByPk(station_id);
            const socketManager = getSocketManager();
            await socketManager.broadcastStationUpdated(updatedStation);
        }
        await sendEmail("chargingStart", user.email, date.full);
        const role = await createHashToken(user.role);
        const history = await chargeHistoryRepo.create({
            user_id: login,
            station_id,
            start_time: new Date(),
            end_time: null,
            energy_kwh: station.energy_kwh,
        });
        return { role, ...history.dataValues };
    }


    async stopCharging(login, station_id) {
        const user = await User.findByPk(login);
        const date = formatDate(new Date());
        const history = await chargeHistoryRepo.findActiveByUserAndStation(login, station_id);
        const station = await Station.findByPk(station_id);
        if (!history) throw new Error("No active charging session found");
        // 1. End time
        const endTime = new Date();
        history.end_time = endTime;
        // 2. Duration in minutes
        const durationMinutes = (endTime - history.start_time) / (1000 * 60);
        // 3. Energy consumed
        const energyKwh = durationMinutes * station.energy_kwh;
        history.energy_kwh = Number(energyKwh.toFixed(2));
        // 4. Total price
        const totalPrice = history.energy_kwh * station.price_per_kwh;
        history.total_price = Number(totalPrice.toFixed(2));
        // 5. Save history
        await chargeHistoryRepo.update(history);
        // 6. Update station to available
        const updated = await stationRepo.updateById(station.id, { status: "available" });
        // 7. Update user role back to normal
        await userRepository.updateUserRole(login, "user");
        // 8. Reload the station to broadcast correct data
        let updatedStation = station;
        if (updated) {
            updatedStation = await Station.findByPk(station_id);
        }
        // 9. Email
        await sendEmail("chargingEnd", user.email, {
            address: station.address,
            start: formatDate(history.start_time).time,
            end: date.time,
            energy: history.energy_kwh,
            total: history.total_price,
            time: timePassed(history.start_time, endTime)
        });
        // 10. Broadcast updated station
        const socketManager = getSocketManager();
        await socketManager.broadcastStationUpdated(updatedStation);

        return history;
    }



    async getByUserAndStation(login, station_id) {
        return await chargeHistoryRepo.findByUserAndStation(login, station_id);
    }

    async getHistoryByStation(station_id) {
        return await chargeHistoryRepo.findByStation(station_id);
    }
}

export default new ChargeHistoryService();
