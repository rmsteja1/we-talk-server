const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const router = express.Router();
const path = require("path");
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const { uploadFile, getFileStream } = require('./s3')


dotenv.config();

var options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const mongoDB='mongodb+srv://tejaramisetty:cmpe2022211@cluster0.sz9jt.mongodb.net/weTalkDB?retryWrites=true&w=majority';
mongoose.connect(mongoDB, options, (err, res) => {
  if (err) {clear
      console.log(err);
      console.log(`MongoDB Connection Failed`);
  } else {
     // auth();
      console.log(`MongoDB Connected`);
  }
});


//app.use("/images", express.static(path.join(__dirname, "public/images")));
app.get('/images/:key', (req, res) => {
  console.log(req.params)
  const key = req.params.key
  const readStream = getFileStream(key)

  readStream.pipe(res)
})

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file
    console.log(file)
    const result = await uploadFile(file)
    await unlinkFile(file.path)
    console.log(result)
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.listen(8800, () => {
  console.log("Backend server is running!");
});
