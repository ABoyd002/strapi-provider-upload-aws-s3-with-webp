/**
 * Module dependencies
 */

const AWS = require("aws-sdk");
const sharp = require("sharp");

module.exports = {
  init(config) {
    const S3 = new AWS.S3({
      apiVersion: "2006-03-01",
      ...config,
    });

    function isImage(file) {
      const types = [".png", ".jpg", ".gif", ...config];

      return Object.values(types).forEach((type) => {
        if (file.ext === types[type]) return true;

        return false;
      });
    }

    return {
      async upload(file, customParams = {}) {
        return new Promise((resolve, reject) => {
          // upload file on S3 bucket
          const path = file.path ? `${file.path}/` : "";
          S3.upload(
            {
              Key: `${path}${file.hash}${file.ext}`,
              Body: Buffer.from(file.buffer, "binary"),
              ACL: "public-read",
              ContentType: file.mime,
              ...customParams,
            },
            (err) => {
              if (err) {
                return reject(err);
              }

              return resolve();
            },
          );

          if (isImage(file)) {
            const webP = sharp(file.buffer)
              .webp()
              .toBuffer();

            S3.upload(
              {
                Key: `webp/${path}${file.hash}.webp`,
                Body: Buffer.from(webP.buffer, "binary"),
                ACL: "public-read",
                ContentType: file.mime,
                ...customParams,
              },
              (err) => {
                if (err) {
                  return reject(err);
                }

                return resolve();
              },
            );
          }
        });
      },
      delete(file, customParams = {}) {
        return new Promise((resolve, reject) => {
          // delete file on S3 bucket
          const path = file.path ? `${file.path}/` : "";
          S3.deleteObject(
            {
              Key: `${path}${file.hash}${file.ext}`,
              ...customParams,
            },
            (err) => {
              if (err) {
                return reject(err);
              }

              return resolve();
            },
          );
          S3.deleteObject(
            {
              Key: `webp/${path}${file.hash}.webp`,
              ...customParams,
            },
            (err) => {
              if (err) {
                return reject(err);
              }

              return resolve();
            },
          );
        });
      },
    };
  },
};
