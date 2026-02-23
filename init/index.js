const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.MONGODB_URL;

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "695fad93b8586a09170cdb25",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

if (require.main === module) {
  main()
    .then(() => {
      console.log("connected to DB");
      return initDB();
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = { initDB };
