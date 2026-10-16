const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const originalName = path.parse(file.originalname).name;
    const extension = path.extname(file.originalname);

    const fileName =
      originalName + "-" + uniqueSuffix + extension;

    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
});

module.exports = upload;