import { ref, set, onDisconnect, onValue } from "firebase/database";
import { rtdb } from "./firebase";

export function setupPresence(uid) {
  if (!uid) return;

  const userRef = ref(rtdb, `/status/${uid}`);
  const connectedRef = ref(rtdb, ".info/connected");

  onValue(connectedRef, (snap) => {
    if (snap.val() !== true) return;

    // 🔥 set ONLINE ngay khi connect
    set(userRef, {
      state: "online",
      lastChanged: Date.now(),
    });

    // 🔥 auto OFFLINE khi mất mạng / close tab
    onDisconnect(userRef)
      .set({
        state: "offline",
        lastChanged: Date.now(),
      })
      .catch(console.error);
  });
}