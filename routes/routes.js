const {
  login,
  orders,
  viewOrder,
  deleteOrder,
  userInfo,
  updateUser,
  editOrder,
} = require("../controllers/controllers");
const verifyUser = require("../middlewares/VerifyUser");

const router = require("express").Router();

router.post("/login", login);

router.get("/order_items", verifyUser, orders);

router.get("/order_items/:id", verifyUser, viewOrder);

router.get("/account", verifyUser, userInfo);

router.delete("/order_items/:id", verifyUser, deleteOrder);

router.put("/account", verifyUser, updateUser);

router.put("/order_items/edit/:id", verifyUser, editOrder);

module.exports = router;
