const router = require("express").Router();
const conversationController = require("../controllers/conversation");

router.post("", conversationController.newConversation);
router.get("/:userId", conversationController.myConversations);

module.exports = router;
