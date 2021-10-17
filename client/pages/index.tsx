import styles from "../styles/Home.module.css";
import { useSockets } from "../context/socket.context";

import RoomContainer from "../containers/Rooms";
import MessageConainer from "../containers/Messages";
import { useEffect, useRef } from "react";

export default function Home() {
  const { socket, username, setUsername } = useSockets();
  const usernameRef = useRef(null);

  useEffect(() => {
    () => {
      return socket.disconnect();
    };
  });

  const handleUsername = () => {
    const value = usernameRef.current.value;
    if (!value) {
      return;
    }

    setUsername(value);

    localStorage.setItem("username", value);
  };

  useEffect(() => {
    if (usernameRef)
      usernameRef.current.value = localStorage.getItem("username") || "";
  }, []);

  return (
    <>
      {!username && (
        <div className={styles.usernameWrapper}>
          <div className={styles.usernameInner}>
            <input placeholder="Username" ref={usernameRef}></input>
            <button className="cta" onClick={handleUsername}>
              Start
            </button>
          </div>
        </div>
      )}
      {username && (
        <div className={styles.container}>
          <RoomContainer />
          <MessageConainer />
        </div>
      )}
    </>
  );
}
