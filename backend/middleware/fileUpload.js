const multer = require("multer");
const fs = require("fs");
const path = require("path");

// get file extension. Ex: DOMException, png, jpeg...
const getFileType = (file) => {
  const mimeType = file.mimetype.split("/");
  return mimeType[mimeType.length - 1];
};

const fileNameGenerator = (req, file, cb) => {
  const file_name = Date.now() + "-" + file.originalname;
  cb(null, file_name);
};

// filter uploaded files - check if they are images and videos
const fileFilter = (req, file, cb) => {
  const file_type = getFileType(file);

  const allowed_types = /jpeg|jpg|png|mp4|mov|gif|docx|pdf|xls|doc|ppt|pptx/;

  const passed = allowed_types.test(file_type);

  if (passed) {
    return cb(null, true);
  }

  req.fileValidationError = "Invalid File!";
  return cb(new Error("Invalid File!"), false);
};

exports.filesUpload = (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const { conversationId } = req.body;
      const dest = "uploads/conversation";

      fs.access(dest, (err) => {
        if (err) {
          return fs.mkdir(dest, (err) => {
            cb(err, false);
          });
        }

        return cb(null, dest);
      });
    },
    filename: fileNameGenerator,
  });

  return multer({ storage, fileFilter }).array("files")(
    req,
    res,
    function (err) {
      console.log(req.files);
      if (req.fileValidationError) {
        return res.send(req.fileValidationError);
      } else if (!req.files.length) {
        return res.status(400).json({
          success: false,
          msg: "No file selected",
        });
      } else if (err instanceof multer.MulterError) {
        return res.status(500).json({
          success: false,
          msg: err,
        });
      } else if (err) {
        return res.send(err);
      }

      const paths = req.files.map((file) => file.path);

      return res.status(200).json({
        success: true,
        paths,
      });
    }
  );
};
