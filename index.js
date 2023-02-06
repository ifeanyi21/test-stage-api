const express = require("express");
const cors = require("cors");

const app = express();

// Port
const PORT = 4100;

app.use(cors());
app.use(express.json());
const routes = require("./routes/routes");

app.use("/api/", routes);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

// const http = require("http")
// const PORT = 4000

// const server = http.createServer((req,res)=>{
//     res.statusCode = 200;
//     res.setHeader('Content-Type',"applicatiom/json")
//     const data = {message:"Hello World"}
//     res.end(JSON.stringify(data))
// })

// server.listen(PORT,()=>{
//     `server is running on PORT ${PORT}`
// })
