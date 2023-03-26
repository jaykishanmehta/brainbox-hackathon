var AWS = require("aws-sdk");
var constants = require("../helpers/constants.json");
AWS.config.update({
  apiVersion: "2016-06-27",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  accessSecretKey: process.env.AWS_ACCESS_SECRET_TOKEN,
  region: "ap-south-1",
});
const docClient = new AWS.DynamoDB.DocumentClient();

function scan(TableName) {
  const params = {
    TableName: TableName,
  };

  docClient.scan(params, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      const { Items } = data;
      console.log("items===", Items);
      return Items;
    }
  });
}

function add(TableName, item) {
  var params = {
    TableName: TableName,
    Item: item,
  };

  // Call DynamoDB to add the item to the table
  docClient.put(params, function (err, data) {
    if (err) {
      console.log("err===", err);

      // res.send({
      //   success: false,
      //   message: err,
      // });
    } else {
      console.log("added===", data);
      // res.send({
      //   success: true,
      //   message: "Added movie",
      //   movie: data,
      // });
    }
  });
}

function analyse(req, res, next) {
  next();
}

async function analyseLogic(present_count) {
  // const present_count = await scan(constants.FLOOR_TABLE_NAME);
  let percentage = {},
    source = -1,
    destination = -1,
    under_utilized = false;
  Object.keys(present_count).forEach((item) => {
    percentage[item] =
      present_count[item].present / present_count[item].capacity;
  });
  Object.keys(percentage).forEach((key) => {
    if (percentage[key] <= 0.2) {
      under_utilized = true;
      source = key;
      destination = findFloor(key, present_count, percentage);
      console.log("floor=", source, " people Kindly move to ", destination);
    }
  });
  const { expected_consumption, actual_consumption } = getPowerCOnsumption(
    source,
    present_count
  );

  return {
    source,
    destination,
    source_count: source != -1 ? present_count[source].present : "NA",
    destination_vacancy:
      destination != -1 ? present_count[destination].capacity : "NA",
    under_utilized,
    expected_consumption,
    actual_consumption,
  };
}

function findFloor(source, present_count, percentage) {
  let result = -1;
  Object.keys(present_count).forEach((item) => {
    let vacancy = present_count[item].capacity - present_count[item].present;
    if (present_count[source].present <= vacancy && result == -1) {
      result = item;
    }
  });
  return result;
}

function getPowerCOnsumption(source, present_count) {
  let expected_consumption = 0,
    actual_consumption = 0;
  Object.keys(present_count).forEach((item) => {
    expected_consumption =
      expected_consumption + present_count[item].hourly_consumption;
    if (item != source) {
      actual_consumption =
        actual_consumption + present_count[item].hourly_consumption;
    }
  });
  return {
    expected_consumption,
    actual_consumption,
  };
}

module.exports = {
  scan,
  add,
  analyse,
  analyseLogic,
};
