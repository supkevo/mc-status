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
    const res = await fetch(API); // Node 18+ has built-in fetch
    const data = await res.json();

    if (data.online) {
      status = "online";
      lastOffline = null;
    } else {
      if (status !== "offline") {
        lastOffline = Date.now();
      }
      status = "offline";
    }

  } catch (e) {
    status = "offline";
    if (!lastOffline) lastOffline = Date.now();
  }
}

setInterval(checkServer, 30000);
checkServer();

app.get("/", (req, res) => {
  res.send("MC Status API running. Use /status");
});

app.get("/status", (req, res) => {
  res.json({ status, lastOffline });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
