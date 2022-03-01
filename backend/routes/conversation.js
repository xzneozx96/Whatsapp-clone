const router = require("express").Router();
const conversationController = require("../controllers/conversation");

router.post("", conversationController.newConversation);
router.get("/:userId", conversationController.myConversations);
router.post("/search-users", conversationController.searchUsers);
router.post("/mark-seen", conversationController.markSeen);
router.get(
  "/single/:conversationId",
  conversationController.getSingleConversation
);

module.exports = router;
