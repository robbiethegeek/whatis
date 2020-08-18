const bunyan = require("bunyan");
const csv = require("csvtojson");
const express = require("express");
const { env, exit } = require("process");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { search } = require("./search");
const Logger = require("bunyan");
let dataSet;

const log = bunyan.createLogger({ name: "whatis" });
if (!env.ACRONYMS_URL) {
  log.fatal("No ACRONYMS_URL environment variable");
  exit(1);
}
app.post("/", (req, res) => {
  const sendResponse = (input) => {
    const body = search(input, dataSet);
    if (body) {
      let returnText = `The acronym: ${input} is ${body.definition}`;
      if (body.context) {
        returnText += `in the ${body.context} context.`;
      }
      const returnBody = {
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: returnText,
            },
          },
        ],
      };
      if (body.notes) {
        returnBody.blocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: body.notes,
          },
        });
      }
      res.send(returnBody);
    } else {
      log.info("No acronym found matching: %s", input);
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
            log.info(JSON.stringify(jsonObj, "", 2));
            dataSet = jsonObj;
            sendResponse(acronym);
          });
      }
    })();
  };
  const acronym = req.body.text ? req.body.text : undefined;
  if (!acronym) {
    log.info("No text key in POST request.");
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
