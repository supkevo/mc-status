const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const SERVER_IP = "AtlasWNations.aternos.me";
const API = `https://api.mcsrvstat.us/2/${SERVER_IP}`;

let status = "unknown";
let lastStatus = "unknown";
let lastOffline = null;

async function checkServer() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    console.log("API RESPONSE:", data);

    // SIMPLE RELIABLE CHECK
    const actuallyOnline = data?.online === true;

    // STATE CHANGE LOGIC
    if (actuallyOnline) {

      status = "online";

    } else {

      status = "offline";

      // ONLY set timestamp when switching ONLINE → OFFLINE
      if (lastStatus === "online") {
        lastOffline = Date.now();
      }
    }

    lastStatus = status;

  } catch (e) {

    console.log("ERROR:", e);

    status = "offline";

    // only set timestamp if it was previously online
    if (lastStatus === "online") {
      lastOffline = Date.now();
    }

    lastStatus = status;
  }
}

checkServer();

setInterval(checkServer, 15000);

app.get("/", (req, res) => {
  res.send("MC Status API Running");
});

// API route
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
