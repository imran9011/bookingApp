const express = require("express");
const router = express.Router();
const multer = require("multer");
const photosMiddleware = multer({ dest: "./uploads" });
const placesControllers = require("../controllers/placesController.js");

router.post("/places", placesControllers.createAccomodation);
router.post("/upload", photosMiddleware.array("photos", 100), placesControllers.uploadImage);
router.post("/upload-by-link", placesControllers.uploadImageByLink);
router.get("/user-places", placesControllers.getUserAccomodations);
router.get("/places/:id", placesControllers.getSingleAccomodation);
router.get("/places", placesControllers.getSearchedAccomodations);
router.put("/places", placesControllers.updateAccomodation);
router.put("/place/delete/:id", placesControllers.removeAccomodation);

module.exports = router;
