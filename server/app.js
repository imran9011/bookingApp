require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

// security
const cors = require("cors");
const cookieParser = require("cookie-parser");

// database
const connect = require("./connectDB/connect.js");

// routers
const authRouter = require("./routes/authRoutes.js");
const placesRouter = require("./routes/placesRoutes.js");
const userRouter = require("./routes/userRoutes.js");

// middleware
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.get("/", (req, res) => {
  res.status(200).json("homepage");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/accom", placesRouter);

async function start() {
  try {
    await connect(process.env.MONGO_URL);
    app.listen(10000, console.log("listening"));
  } catch (error) {
    console.log(error);
    throw error;
  }
}
start();
