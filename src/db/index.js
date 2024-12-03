import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const dbConnect = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    // console.log(connectionInstance.connection.port);
    // console.log(connectionInstance.connection.name);
    console.log(
      `Connected to MongoDb database. Host : ${connectionInstance.connection.host}`
    );
  } catch (err) {
    console.log(`Database connection failed. Error: ${err}`);
  }
};

export default dbConnect;
