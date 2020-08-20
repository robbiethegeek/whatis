jest.mock("../logger");
jest.mock("../search");
const { generateResponse } = require("../generateResponse");
const { env } = require("process");
const search = require("../search");

describe("generateResponse", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // most important - it clears the cache
    process.env = { ...OLD_ENV }; // make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // restore old env
  });

  test("no acronym with bad data", () => {
    env.ACRONYMS_URL = "test0/test1/test2/test3/test4/test5";
    const response = generateResponse("robbie", []);
    expect(response.blocks[0].text.text).toContain("robbie");
    expect(response.blocks[0].text.text).toContain(
      "test0//www.github.com/test3/test4"
    );
  });
});
