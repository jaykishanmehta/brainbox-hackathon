var AWS = require("aws-sdk");
const bucket = "singularity-hackathon";
AWS.config.update({
  apiVersion: "2016-06-27",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  accessSecretKey: process.env.AWS_ACCESS_SECRET_TOKEN,
  region: "ap-south-1",
});

const aws_rekog = require("@aws-sdk/client-rekognition");

const REGION = "ap-south-1";

const rekognitionClient = new aws_rekog.RekognitionClient({
  region: REGION,
});

async function countPeople(img) {
  const imageParams = {
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: img,
      },
    },
  };

  const lastdata = await rekognitionClient.send(
    new aws_rekog.DetectLabelsCommand(imageParams)
  );
  let personDetected = false,
    personCount = 0;

  lastdata.Labels.forEach((item, i) => {
    if (item.Name === "Person") {
      console.log("Instances===", item.Instances.length);
      personDetected = true;
      personCount = item.Instances.length;
    }
    if (i === lastdata.Labels.length - 1 && !personDetected) {
      console.log("no person in image");
    }
  });
  return personCount;
}

module.exports = {
  countPeople,
};
