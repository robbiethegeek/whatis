const search = (acronym, dataset) => {
  if (
    typeof acronym !== "string" ||
    (typeof dataset !== "object" && dataset.length === 0)
  ) {
    return undefined;
  } else {
    return dataset.find(
      (current) => current.acronym.toLowerCase() == acronym.toLowerCase()
    );
  }
};

module.exports = {
  search,
};
