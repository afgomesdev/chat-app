import { useRef } from "react";
import EVENTS from "../config/events";
import { useSockets } from "../context/socket.context";
import styles from "../styles/Room.module.css";
function RoomContainer() {
  const { socket, roomId, rooms } = useSockets();

  const newRoomRef = useRef(null);

  function handleCreateRoom() {
    // get the room name
    const roomName = newRoomRef.current.value || "";
    if (!String(roomName).trim()) return;
    // emit room created event
    socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomName, currentRoomId: roomId });
    //set room name input  to empty string
    newRoomRef.current.value = "";
  }

  function handleJoinRoom(key) {
    if (key === roomId) return;

    socket.emit(EVENTS.CLIENT.JOIN_ROOM, { key, currentRoomId: roomId });
  }

  return (
    <nav className={styles.wrapper}>
      <div className={styles.createRoomWrapper}>
        <input placeholder="Room name" ref={newRoomRef} />
        <button className="cta" onClick={handleCreateRoom}>
          CREATE ROOM
        </button>
      </div>
      <ul className={styles.list}>
        {Object.keys(rooms).map((key) => {
          return (
            <div key={key}>
              <button
                disabled={key === roomId}
                title={`Join ${rooms[key].name}`}
                onClick={() => handleJoinRoom(key)}
              >
                {rooms[key].name}
              </button>
            </div>
          );
        })}
      </ul>
    </nav>
  );
}

export default RoomContainer;
