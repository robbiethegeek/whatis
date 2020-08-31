const { returnBody, createBlock } = require("../utility");
const stsiObject = {
  acronym: "STSI",
  definition: "Solution Technology Systems Inc",
  context: "business",
  notes: "This name is going away shortly!",
};
const plurbusObject = {
  acronym: "Pluribus",
  definition: "Pluribus Digital",
  context: "business",
  notes: "",
};
const expectedResponse = returnBody();
describe("utility", () => {
  describe("returnBody", () => {
    test("on call returns and object", () => {
      expect(returnBody()).toBeInstanceOf(Object);
    });
    test("there should be a key of type that has a value of section", () => {
      expect(returnBody().type).toBe("section");
    });
  });
  describe("createBlock", () => {
    test("when an empty item is passed in to create block the text should read badly formed", () => {
      const result = createBlock({});
      expect(result.text).toHaveProperty("text", "Badly formed acronym.");
    });
    test("when called with the stsi acronym it returns correct object", () => {
      const actualResponse = createBlock(stsiObject);
      expectedResponse.text.text =
        "The acronym: STSI is Solution Technology Systems Inc in the business context. This name is going away shortly!";

      expect(actualResponse).toStrictEqual(expectedResponse);
    });
    test("when called with the plurubis acronym it returns correct object", () => {
      expectedResponse.text.text =
        "The acronym: Pluribus is Pluribus Digital in the business context.";
      const actualResponse = createBlock(plurbusObject);
      expect(actualResponse).toStrictEqual(expectedResponse);
    });
  });
});
