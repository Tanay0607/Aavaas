const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js');

async function main(){
    await mongoose.connect(process.env.ATLAS_URL);
}

main()
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log(err);
    });

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj, owner: "6a3e7f3f0ea044e7f892ee59"}));
    await Listing.insertMany(initdata.data);
    console.log('Database initialized');
}   

initDB();