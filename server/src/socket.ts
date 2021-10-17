import { nanoid } from "nanoid";
import { Server, Socket } from "socket.io";
import logger from "./utils/logger";

const EVENTS = {
  connection: "connection",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
    JOIN_ROOM: "JOIN_ROOM",
  },
  SERVER: {
    ROOMS: "ROOMS",
    JOINED_ROOM: "JOINED_ROOM",
    ROOM_MESSAGE: "ROOMS_MESSAGE",
  },
};

const rooms: Record<string, { name: string }> = {};

function socket({ io }: { io: Server }) {
  logger.info(`Sockets enabled`);

  io.on(EVENTS.connection, async (socket: Socket) => {
    // socket.disconnect();
    logger.info(`user connected ${socket.id}`);

    socket.emit(EVENTS.SERVER.ROOMS, rooms);
    /*
     * Whena user creates a new room
     */
    socket.on(
      EVENTS.CLIENT.CREATE_ROOM,
      async ({ roomName, currentRoomId }) => {
        //create  a room Id
        const roomId = nanoid();

        //add a new room to the rooms object
        rooms[roomId] = {
          name: roomName,
        };

        // socket.leave(currentRoomId);

        await socket.join(roomId);
        //broadcast an event saying there is a new room
        socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);
        //emit back to the room creator with all the rooms
        socket.emit(EVENTS.SERVER.ROOMS, rooms);
        //emit event back the room creator sating they have joined
        socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
      }
    );

    /*
     * Whena user sends a room message
     */
    socket.on(
      EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      ({ roomId, message, username }) => {
        const date = new Date();
        socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
          message,
          username,
          time: `${date.getHours()}:${date.getMinutes()}`,
        });
      }
    );

    /*
     * When a user joins a room
     */
    socket.on(EVENTS.CLIENT.JOIN_ROOM, async ({ key, currentRoomId }) => {
      // socket.leave(currentRoomId);

      await socket.join(key);
      socket.emit(EVENTS.SERVER.JOINED_ROOM, key);
    });
  });
}

export default socket;
