const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../models/toursModel");
const Review = require("./../models/reviewModel");
const User = require("./../models/usersModel");

// dotenv.config({ path: '' });

// const DB = process.env.DATABASE;
const DB = "mongodb+srv://adel:tours123@cluster0.8zvjdce.mongodb.net/natours";

console.log("DB :>> ", DB);
mongoose.connect(DB).then(() => console.log("DB connection successful!"));

// // READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
// const reviews = JSON.parse(
//     fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
// );

// // IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tour.create(tours);
        // await User.create(users, { validateBeforeSave: false });
        // await Review.create(reviews);
        console.log("Data successfully loaded!");
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// // DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        // await User.deleteMany();
        // await Review.deleteMany();
        console.log("Data successfully deleted!");
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === "--import") {
    importData();
} else if (process.argv[2] === "--delete") {
    deleteData();
}
