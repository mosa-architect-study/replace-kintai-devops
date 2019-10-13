const express = require("express");
const app = express();

app.post("/",(req,res) =>{
    console.log(req.body)
    res.json({
        hoge:"hoge"
    })
})

app.listen(process.env.PORT || 8080)