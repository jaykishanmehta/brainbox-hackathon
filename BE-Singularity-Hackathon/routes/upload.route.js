const express = require("express");
const router = express.Router();
var cors = require("cors");

const AWS = require("aws-sdk");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const rekog = require("../services/aws-rekog");
const analysis = require("../services/analysis");
var constants = require("../helpers/constants.json");

const s3Client = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  accessSecretKey: process.env.AWS_ACCESS_SECRET_TOKEN,
  region: "ap-south-1",
});
const docClient = new AWS.DynamoDB.DocumentClient();

var corsOptions = {
  origin: "*",
};
const uploadParams = {
  Bucket: "singularity-hackathon",
  Key: "",
  Body: null,
};

router.post("/api/file/upload", cors(), upload.single("file"), (req, res) => {
  const params = uploadParams;

  uploadParams.Key = req.file.originalname;
  uploadParams.Body = req.file.buffer;
  const floor = req.body.floor;

  s3Client.upload(params, async (err, data) => {
    if (err) {
      res.status(500).json({ error: "Error -> " + err });
    }
    const count = await rekog.countPeople(req.file.originalname);
    await analysis.add("floor_plan_and_presence", {
      id: floor,
      present: count,
      capacity: constants.floors[floor].total,
      hourly_consumption: constants.floors[floor].hourly_consumption,
      ahu_running: count > 0 ? 1 : 0,
    });
    // const scanRes = await analysis.scan("floor_plan_and_presence");
    // console.log("scanRes====", scanRes);
    res.json({
      message: "File uploaded successfully",
      filename: req.file.originalname,
      location: data.Location,
      count: count,
    });
  });
});

router.get("/analyse", (req, res, next) => {
  const params = {
    TableName: "floor_plan_and_presence",
  };

  docClient.scan(params, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      const { Items } = data;
      console.log("items===", Items);
      // return Items;
      analysis.analyse(req, res, async () => {
        const {
          source,
          destination,
          source_count,
          destination_vacancy,
          under_utilized,
          expected_consumption,
          actual_consumption,
        } = await analysis.analyseLogic(Items);
        res.json({
          source,
          destination,
          source_count,
          destination_vacancy,
          under_utilized,
          expected_consumption,
          actual_consumption,
        });
      });
    }
  });
});

module.exports = router;
