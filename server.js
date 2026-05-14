cconst express = require("express");
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

    console.log("API RESPONSE:", data);

    // better Aternos detection
    const actuallyOnline =
      data.online === true &&
      data.debug &&
      data.debug.ping === true;

    if (actuallyOnline) {

      status = "online";

    } else {

      // only set timestamp first time going offline
      if (status !== "offline") {
        lastOffline = Date.now();
      }

      status = "offline";
    }

  } catch (e) {

    console.log("ERROR:", e);

    if (status !== "offline") {
      lastOffline = Date.now();
    }

    status = "offline";
  }
}

// check every 5 seconds
setInterval(checkServer, 5000);

// first check immediately
checkServer();

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

// Render port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
