const { returnBody } = require("../utility");

describe("utility", () => {
  describe("returnBody", () => {
    test("on call returns and object", () => {
      expect(returnBody()).toBeInstanceOf(Object);
    });
    test("there should be a key of type that has a value of section", () => {
      expect(returnBody().type).toBe("section");
    });
  });
});
