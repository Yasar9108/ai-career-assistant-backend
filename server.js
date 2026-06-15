const connectDb = require("./src/conf/db");
const app = require("./src/app");
require("dotenv").config();

connectDb()

app.listen(process.env.PORT , ()=>{
    console.debug(" Server is running on port " + process.env.PORT);
})

app.get("/", (req, res)=>{
    res.send("Welcome to AI Career Assistant API");
})


