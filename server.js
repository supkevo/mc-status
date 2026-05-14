const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

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

    console.log(data);

    const actuallyOnline =
      data.online === true &&
      data.debug &&
      data.debug.ping === true;

    if (actuallyOnline) {

      status = "online";

    } else {

      if (status !== "offline") {
        lastOffline = Date.now();
      }

      status = "offline";
    }

  } catch (e) {

    console.log(e);

    if (status !== "offline") {
      lastOffline = Date.now();
    }

    status = "offline";
  }
}

checkServer();

setInterval(checkServer, 5000);

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
