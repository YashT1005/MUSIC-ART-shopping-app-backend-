const express = require("express");
const jwtVerify = require("../middlewares/authMiddleware");
const { createCart, getAllData, getCartData, getProductDetails, modifyCartValue, createInvoice, getInvoice, deleteCart } = require("../controllers/CartController");


const router = express.Router();


router.route("/create").post(jwtVerify, createCart);
router.route("/getData").get(getAllData)
router.route("/getCartData").get(jwtVerify, getCartData)
router.route("/details").get(getProductDetails)
router.route("/modifyQuantity").put(jwtVerify, modifyCartValue)
router.route("/createInvoice").post(jwtVerify, createInvoice)
router.route("/getInvoice").get(jwtVerify, getInvoice)
router.route("/deleteCart").delete(jwtVerify, deleteCart)

module.exports = router;