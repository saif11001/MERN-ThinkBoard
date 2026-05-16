import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Mongo DB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log('Error connection to Mongo DB: ', error.message);
        process.exit(1);
    }       
}