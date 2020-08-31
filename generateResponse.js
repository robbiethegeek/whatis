const path = require("path");
const { search } = require("./search");
const { returnBody, createBlock } = require("./utility");
const { log } = require("./logger");
const { env } = require("process");

const generateResponse = (acronym, dataset) => {
  const body = search(acronym, dataset);
  const returnObject = {
    blocks: [],
  };
  if (body && body.length) {
    for (current of body) {
      returnObject.blocks.push(createBlock(current));
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
