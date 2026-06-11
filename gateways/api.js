import proxy from 'express-http-proxy';
import express from "express";

const app = express();
const PORT = 8000

app.get("/", (req,res) => {
    res.send("hi-server")
})

app.use("/user", proxy("http://localhost:3000"))
app.use("/1post", proxy("http://localhost:3001"))
app.use("/2post/", proxy("http://localhost:3003"))
app.use("/p2ost", proxy("http://localhost:3005"))
app.use("/p223ost", proxy("http://localhost:3006"))
app.use("/p1ost", proxy("http://localhost:3008"))

app.listen(PORT, () => {
    console.log(`sever port: http://localhost:${PORT}`)
})