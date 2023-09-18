import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`Connected To DB on the host: ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error: ${err}`);
    process.exit(1);
  }
};

export default connectToDB;
