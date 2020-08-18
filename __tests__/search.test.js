const { search } = require("../search");
const testAcronym = "stsi";
const expectedResponse = {
  acronym: "STSI",
  definition: "Solution Technology Systems Inc.",
  context: "",
  notes: "",
};
const testValid = [expectedResponse];

test("verify that when empty data it returns undefined", () => {
  expect(search(testAcronym, [])).toBe(undefined);
});
test("get back valid correct JSON object when acronym is found", () => {
  expect(search(testAcronym, testValid)).toBe(expectedResponse);
});
test("verify that you get undefined when the acronym is not found.", () => {
  expect(search("nope", testValid)).toBe(undefined);
});
test("verify that you get undefined when the acronym is empty.", () => {
  expect(search("", testValid)).toBe(undefined);
});
test("verify that you get undefined when the acronym is a number.", () => {
  expect(search(1, testValid)).toBe(undefined);
});
