const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const SERVER_IP = "AtlasWNations.aternos.me";
const API = `https://api.mcsrvstat.us/2/${SERVER_IP}`;

let status = "unknown";
let lastOffline = null;
let lastStatus = "unknown";

async function checkServer() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    console.log("API:", data);

    // SIMPLE + RELIABLE (DO NOT OVERCOMPLICATE)
    const actuallyOnline = data && data.online === true;

    if (actuallyOnline) {

      status = "online";

    } else {

      // only set offline time when it FIRST changes to offline
      if (lastStatus !== "offline") {
        lastOffline = Date.now();
      }

      status = "offline";
    }

    lastStatus = status;

  } catch (e) {

    console.log("ERROR:", e);

    if (lastStatus !== "offline") {
      lastOffline = Date.now();
    }

    status = "offline";
    lastStatus = status;
  }
}

// run immediately
checkServer();

// check every 5 seconds
setInterval(checkServer, 5000);

// homepage
app.get("/", (req, res) => {
  res.send("MC Status API Running");
});

// status endpoint
app.get("/status", (req, res) => {
  res.json({
    status,
    lastOffline
  });
});

// render port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
