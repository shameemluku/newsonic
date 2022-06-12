const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fileUpload = require("express-fileupload");
const asyncHandler = require("express-async-handler");
const { getFileStream } = require("./config/s3");
require("dotenv").config();

//Routes

const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");
const channelRoutes = require("./routes/channel");
const adRoutes = require("./routes/ad");
const paymentRoutes = require("./routes/payment");
const adminRoutes = require("./routes/admin");

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser("SECRET"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: true, credentials: true }));
app.use(fileUpload());

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/channel", channelRoutes);
app.use("/api/ad", adRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

// GET S3 OBJECT

app.use(
  "/api/uploads/:key",
  asyncHandler((req, res) => {
    if (req.params.key === "undefined")
      return res.status(404).json({ message: "Resourse not found" });
    getFileStream(req.params.key)
      .on("error", (err) => {
        if (!res.headersSent)
          return res.status(404).json({ message: "Resourse not found" });
      })
      .pipe(res);
  })
);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log("Server running on PORT : " + PORT))
  )
  .catch((error) => console.log(error.message));
