const router = require("express").Router();
const conversationController = require("../controllers/conversation");

router.post("", conversationController.newConversation);
router.get("/:userId", conversationController.myConversations);
router.get(
  "/single/:conversationId",
  conversationController.getSingleConversation
);

module.exports = router;
