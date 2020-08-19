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
    const returnBody = {
      type: "section",
      text: {
        type: "mrkdwn",
      },
    };
    const returnObject = {
      blocks: [],
    };
    if (body.length) {
      for (current of body) {
        let returnText = `The acronym: ${input} is ${current.definition}`;
        const currentAcronym = Object.assign({}, returnBody);
        if (current.context) {
          returnText += ` in the ${current.context} context.`;
        }
        currentAcronym.text["text"] = returnText;
        if (current.notes) {
          currentAcronym.text["text"] += ` ${current.notes}`;
        }
        returnObject.blocks.push(currentAcronym);
      }
    } else {
      log.info("No acronym found matching: %s", input);
      const noAcronym = Object.assign({}, returnBody);
      noAcronym.text.text = `No acronym found matching: ${input}`;
      returnObject.blocks.push(noAcronym);
    }
    res.send(returnObject);
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
