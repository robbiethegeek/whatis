const { search } = require("../search");
const testAcronym = "stsi";
const expectedResponse = {
  acronym: "STSI",
  definition: "Solution Technology Systems Inc.",
  context: "",
  notes: "",
};
const testValid = [expectedResponse];
const testValid2 = [...testValid, expectedResponse];

test("verify that when empty data it returns undefined", () => {
  expect(search(testAcronym, [])).toBeUndefined();
});
test("get back valid correct JSON object when acronym is found", () => {
  expect(search(testAcronym, testValid)).toContain(expectedResponse);
});
test("get back only 1 JSON object when acronym is found and there is 1", () => {
  expect(search(testAcronym, testValid).length).toEqual(1);
});

test("get back 2 JSON object when acronym is found and there are 2", () => {
  expect(search(testAcronym, testValid2).length).toEqual(2);
});
test("verify that you get an empty array when the acronym is not found.", () => {
  expect(search("nope", testValid)).toStrictEqual([]);
});
test("verify that you get undefined when the acronym is empty.", () => {
  expect(search("", testValid)).toBe(undefined);
});
test("verify that you get undefined when the acronym is a number.", () => {
  expect(search(1, testValid)).toBe(undefined);
});
