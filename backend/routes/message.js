const router = require("express").Router();
const messageController = require("../controllers/message");

router.post("", messageController.newMessage);
// router.get("/:conversationId", messageController.conversationMessages);
router.get("/:conversationId", messageController.conversationPaginatedMessages);

module.exports = router;
