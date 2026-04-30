import express from "express";

const PORT = 3000

const app = express();

app.get("/health", (req, res)=>{
    res.send("ok");
})

app.listen(PORT, ()=>{
    console.log(`server is lisening on http://localhost:${PORT}`)
})
