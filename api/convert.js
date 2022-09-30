/** Convert JPG/PNG images to WebP format */
const sharp = require('sharp');

exports.handler = async (event) => {
  const dataURL = event.body;
  return {
    statusCode: 200,
    body: await convertToWebP(dataURL),
  };
};

async function convertToWebP(data) {
  const regexp = /data:image\/\w+;base64,(?<imageURL>[ -~]+)/;
  const { imageURL } = data.match(regexp).groups;
  const imageBuffer = Buffer.from(imageURL, 'base64');

  const convertedImageBuffer = await sharp(imageBuffer).webp().toBuffer();
  const newDataURL = Buffer.from(convertedImageBuffer).toString('base64');

  return `data:image/webp;base64,${newDataURL}`;
}
