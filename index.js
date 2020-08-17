const bunyan = require("bunyan");
const csv = require("csvtojson");
const express = require("express");
const { env, exit } = require("process");
const fetch = require("node-fetch");

const app = express();
const { search } = require("./search");

const log = bunyan.createLogger({ name: "whatis" });
if (!env.ACRONYMS_URL) {
  console.log("Please make sure there is a ACRONYMS_URL environment variable");
  exit(1);
}
app.get("/", (req, res) => {
  let dataSet;
  const sendResponse = (input) => {
    const body = search(input, dataSet);
    if (body) {
      res.send(body);
    } else {
      res.sendStatus(404);
    }
  };
  const loadDataAndSendResponse = () => {
    (async () => {
      const response = await fetch(env.ACRONYMS_URL);
      if (response.ok) {
        const body = await response.text();
        csv()
          .fromString(body)
          .then((jsonObj) => {
            log.info(jsonObj);
            dataSet = jsonObj;
            sendResponse(acronym);
          });
      }
    })();
  };
  const acronym = req.query.acronym ? req.query.acronym.toString() : undefined;
  if (!acronym) {
    res.sendStatus(400);
  } else {
    if (!dataSet) {
      loadDataAndSendResponse();
    } else {
      sendResponse(acronym);
    }
  }
});
app.listen(env.PORT ? env.PORT : "80");
