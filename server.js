const express = require("express");
const fetch = require("node-fetch");

const app = express();

const SERVER_IP = "YOURSERVER.aternos.me";
const API = `https://api.mcsrvstat.us/2/${SERVER_IP}`;

let status = "unknown";
let lastOffline = null;

async function checkServer() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    if (data.online) {
      if (status !== "online") {
        console.log("Server ONLINE");
      }
      status = "online";
    } else {
      if (status !== "offline") {
        console.log("Server OFFLINE");
        lastOffline = Date.now();
      }
      status = "offline";
    }
  } catch (e) {
    console.log("Error:", e.message);
  }
}

setInterval(checkServer, 30000);
checkServer();

app.get("/status", (req, res) => {
  res.json({
    status,
    lastOffline
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
