import mongoose from "mongoose";
import dotenv from "dotenv";
import "../models/Vacantes.js"
dotenv.config({ path: ".env" });

mongoose.connect(process.env.DATABASE, {useNewUrlParser: true});

mongoose.connection.on("error", (error) => {
    console.log(error);
});

mongoose.connection.on("connected", () => {
    console.log("Connected to database");
});
