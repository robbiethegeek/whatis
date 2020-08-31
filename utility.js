const returnBody = () => {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "",
    },
  };
};

const createBlock = (currentItem) => {
  const currentAcronym = returnBody();
  let returnText;
  if (!currentItem.acronym || !currentItem.definition) {
    returnText = "Badly formed acronym.";
  } else {
    returnText = `The acronym: ${currentItem.acronym} is ${currentItem.definition}`;
    if (currentItem.context) {
      returnText += ` in the ${currentItem.context} context.`;
    }
  }
  currentAcronym.text["text"] = returnText;
  if (currentItem.notes) {
    currentAcronym.text["text"] += ` ${currentItem.notes}`;
  }
  return currentAcronym;
};

module.exports = {
  returnBody,
  createBlock,
};
