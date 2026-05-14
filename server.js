const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const SERVER_IP = "AtlasWNations.aternos.me";
const API = `https://api.mcsrvstat.us/2/${SERVER_IP}`;

let status = "unknown";
let lastOffline = null;

async function checkServer() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    const actuallyOnline = data?.online === true;

    // FIRST RUN FIX (prevents null + wrong state)
    if (status === "unknown") {
      status = actuallyOnline ? "online" : "offline";

      if (!actuallyOnline) {
        lastOffline = Date.now();
      }

      return;
    }

    // STATE CHANGE LOGIC
    if (actuallyOnline) {

      status = "online";

    } else {

      // ONLY set timestamp when going ONLINE → OFFLINE
      if (status === "online") {
        lastOffline = Date.now();
      }

      status = "offline";
    }

  } catch (e) {

    console.log("ERROR:", e);

    // treat errors as offline
    if (status === "online") {
      lastOffline = Date.now();
    }

    status = "offline";
  }
}

checkServer();

setInterval(checkServer, 15000);

app.get("/", (req, res) => {
  res.send("MC Status API Running");
});

app.get("/status", (req, res) => {
  res.json({
    status,
    lastOffline
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
