const mongoose = require("mongoose");

const url =
"mongodb://tanay:Tanay2206@ac-jrvxmo2-shard-00-00.rvjbxya.mongodb.net:27017,ac-jrvxmo2-shard-00-01.rvjbxya.mongodb.net:27017,ac-jrvxmo2-shard-00-02.rvjbxya.mongodb.net:27017/?ssl=true&replicaSet=atlas-ldslqt-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(url)
.then(() => {
    console.log("Connected");
    process.exit();
})
.catch(err => {
    console.log(err);
});