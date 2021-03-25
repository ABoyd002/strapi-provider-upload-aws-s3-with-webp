const { isImage } = require('../lib/index');

describe("isImage function", () => {
  test("Should only convert image files to webp", () => {
    const input = { ext: ".png" };
    const output = true;

    expect(isImage(input)).toEqual(output);
  });
});