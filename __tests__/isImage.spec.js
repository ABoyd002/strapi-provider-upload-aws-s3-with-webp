const { isImage } = require("../lib/index");

describe("isImage function", () => {
  it("image file", () => {
    expect.assertions(1);

    const input = { ext: ".png" };
    const output = true;

    expect(isImage(input)).toStrictEqual(output);
  });

  it("non-image file", () => {
    expect.assertions(1);

    const input = { ext: ".csv" };
    const output = false;

    expect(isImage(input)).toStrictEqual(output);
  });
});
