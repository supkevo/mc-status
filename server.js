const express = require("express");
const fetch = require("node-fetch");
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

// run every 30 seconds
setInterval(checkServer, 30000);
checkServer();

// homepage fix
app.get("/", (req, res) => {
  res.send("MC Status API running. Use /status");
});

// status endpoint
app.get("/status", (req, res) => {
  res.json({
    status,
    lastOffline
  });
});

// render port fix
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
