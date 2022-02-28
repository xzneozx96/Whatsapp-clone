const router = require("express").Router();
const messageController = require("../controllers/message");
// const { filesUpload } = require("../middleware/fileUpload");

router.post("", messageController.newMessage);
router.post("/files-upload", messageController.fileUpload);
router.get(
  "/:userId/:conversationId",
  messageController.conversationPaginatedMessages
);
router.delete("/unsend/:msgId", messageController.unsendMessage);
router.delete("/:userId/:msgId", messageController.deleteForMe);

module.exports = router;
