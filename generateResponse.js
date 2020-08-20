const path = require("path");
const { search } = require("./search");
const { returnBody } = require("./utility");
const { log } = require("./logger");
const { env } = require("process");
const generateResponse = (acronym, dataset) => {
  const body = search(acronym, dataset);
  const returnObject = {
    blocks: [],
  };
  if (body && body.length) {
    for (current of body) {
      let returnText = `The acronym: ${acronym} is ${current.definition}`;
      const currentAcronym = returnBody();
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
    log.info("No acronym found matching: %s", acronym);
    const noAcronym = returnBody();
    const url = path.parse(env.ACRONYMS_URL).dir.split("/");
    noAcronym.text.text = `No acronym found matching: ${acronym}. To add your acronym please go to ${url[0]}//www.github.com/${url[3]}/${url[4]}`;
    returnObject.blocks.push(noAcronym);
  }
  return returnObject;
};
module.exports = {
  generateResponse,
};
