const app = require("express");
const router = app.Router();
const {
  getProducts,
  createProduct,
  getProductById,
  updateProductById,
  getPhoto,
  filterProducts,
  searchProduct,
  getAvgRating,
  test,
  updateProductSoldAndQuantity,
} = require("../controllers/productControllers");
const admin = require("../middlewares/admin");
const authorize = require("../middlewares/authorize");

router.route("/").post([authorize, admin], createProduct).get(getProducts);

router.route("/:id")
  .get(getProductById)
  .put([authorize, admin], updateProductById);

router.route("/photo/:id").get(getPhoto);

router.route("/filter").post(filterProducts);

router.route("/search").post(searchProduct);

router.route("/data/update").put(updateProductSoldAndQuantity);

router.route("/app/test").get(test);

module.exports = router;
