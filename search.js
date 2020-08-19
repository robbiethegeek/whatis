const search = (acronym, dataset) => {
  if (
    typeof acronym !== "string" ||
    !acronym ||
    typeof dataset !== "object" ||
    (typeof dataset === "object" && dataset.length === 0)
  ) {
    return undefined;
  } else {
    return dataset.filter(
      (current) => current.acronym.toLowerCase() == acronym.toLowerCase()
    );
  }
};

module.exports = {
  search,
};
