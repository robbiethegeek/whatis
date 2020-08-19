const bunyan = require("bunyan");
const csv = require("csvtojson");
const express = require("express");
const { env, exit } = require("process");
const fetch = require("node-fetch");
const path = require("path");

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
        const currentAcronym = JSON.parse(JSON.stringify(returnBody));
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
      const url = path.parse(env.ACRONYMS_URL).dir.split("/");
      noAcronym.text.text = `No acronym found matching: ${input}. To add your acronym please go to ${url[0]}//www.github.com/${url[3]}/${url[4]}`;
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
  const acronym = req.body.text ? req.body.text.toUpperCase() : undefined;
  if (!acronym) {
    log.info("No text key in POST request.");
    res.sendStatus(400);
  } else {
    console.log(req.body);
    if (!req.body.token && req.body.token !== env.SECRET_TOKEN) {
      log.info("Secret token doesn't match!");
      const returnBody = {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Secret token doesn't match!",
        },
      };
      res.send(returnBody);
    } else {
      if (!dataSet) {
        loadDataAndSendResponse();
      } else {
        sendResponse(acronym);
      }
    }
  }
});
app.listen(env.PORT ? env.PORT : "80");
