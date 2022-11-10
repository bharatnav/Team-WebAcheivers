const mongoose = require("mongoose");


mongoose.connect("mongodb://localhost:27017/register",
{
family :4
}).catch((e) => {
    console.log("error connecting to mongoose!");
  });
  mongoose.connection.on("error", (e) => {
    console.log("mongo connect error!");
  });
  mongoose.connection.on("connected", () => {
    console.log("connected to mongo");
  });