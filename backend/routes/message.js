const router = require("express").Router();
const messageController = require("../controllers/message");
const { filesUpload } = require("../middleware/fileUpload");

router.post("", messageController.newMessage);
router.post("/files-upload", filesUpload, messageController.fileUpload);
router.get("/:conversationId", messageController.conversationPaginatedMessages);

module.exports = router;
