const csv = require("csvtojson");
const express = require("express");
const { env, exit } = require("process");
const fetch = require("node-fetch");
const path = require("path");
const { generateResponse } = require("./generateResponse");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { log } = require("./logger");
const { returnBody } = require("./utility");
const e = require("express");
let dataSet;
(async () => {
  const response = await fetch(env.ACRONYMS_URL);
  if (response.ok) {
    const body = await response.text();
    csv()
      .fromString(body)
      .then((jsonObj) => {
        if (jsonObj) {
          log.info(`Data loaded from: ${env.ACRONYMS_URL}`);
          dataSet = jsonObj;
        }
      });
  }
})();

if (!env.ACRONYMS_URL) {
  log.fatal("No ACRONYMS_URL environment variable");
  exit(1);
}
app.post("/", (req, res) => {
  if (!dataSet) {
    log.fatal("No acronyms data loaded.");
    res.send((returnBody().text = "No acronym data loaded."));
    exit(1);
  }
  const acronym = req.body.text ? req.body.text.toUpperCase() : undefined;
  const sendResponse = (input) => {
    res.send(generateResponse(input, dataSet));
  };

  if (!acronym) {
    log.info("No text key in POST request.");
    res.sendStatus(400);
  } else {
    if (!req.body.token && req.body.token !== env.SECRET_TOKEN) {
      log.info("Secret token doesn't match!");
      res.send((returnBody().text = "Secret token doesn't match!"));
    } else {
      sendResponse(acronym);
    }
  }
});
app.listen(env.PORT ? env.PORT : "80");
