// socket.js
import { Server } from "socket.io";

let io = null;

export function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("✅ WebSocket connected:", socket.id);


        socket.on("disconnect", () => {
            console.log("❌ WebSocket disconnected:", socket.id);
        });
    });

    return io;
}

export function getIO() {
    if (!io) {
        throw new Error("❌ Socket.io not initialized");
    }
    return io;
}
