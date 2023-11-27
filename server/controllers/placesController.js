const Place = require("../models/Place.js");
const User = require("../models/User.js");
const path = require("path");
const fs = require("fs");
const imageDownload = require("image-downloader");
const { getUserDataFromToken } = require("../utils/verifyToken");

const createAccomodation = async (req, res) => {
  const userInfo = getUserDataFromToken(req);
  const { title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;
  if (userInfo) {
    const user = await User.findById(userInfo.id);
    if (user) {
      const place = await Place.create({
        owner: userInfo.id,
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      return res.status(201).json(place);
    }
  } else {
    return res.status(401).json({ msg: "Invalid Credentials, Unable to verify" });
  }
};

const removeAccomodation = async (req, res) => {
  const { id } = req.params;
  const userInfo = getUserDataFromToken(req);
  if (userInfo) {
    const place = await Place.findById(id);
    if (userInfo.id === place.owner.toString()) {
      await Place.findByIdAndUpdate(id, { active: false });
      return res.status(200).json("ok");
    }
    return res.status(401).json({ msg: "Invalid Credentials, Unable to verify" });
  } else {
    return res.status(401).json({ msg: "Invalid Credentials, Unable to verify" });
  }
};

const getUserAccomodations = async (req, res) => {
  const userInfo = getUserDataFromToken(req);
  if (userInfo) {
    const data = await Place.find({ owner: userInfo.id, active: true }).sort({ createdAt: 1 });
    return res.status(200).json(data);
  } else {
    return res.status(401).json({ msg: "Invalid Credentials, Unable to verify" });
  }
};

const getSingleAccomodation = async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  res.status(200).json(place);
};

const updateAccomodation = async (req, res) => {
  const userInfo = getUserDataFromToken(req);
  const { id, title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;
  if (userInfo) {
    const place = await Place.findById(id);
    if (userInfo.id === place.owner.toString()) {
      place.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await place.save();
    } else {
      return res.status(401).json({ msg: "Invalid Credentials, Unable to verify" });
    }
    return res.status(201).json(place);
  } else {
    return res.status(401).json({ msg: "Invalid Credentials, Unable to verify" });
  }
};

const getSearchedAccomodations = async (req, res) => {
  const { searched } = req.query;
  if (searched) {
    return res.status(200).json(
      await Place.find({
        $and: [
          { active: true },
          {
            $or: [
              {
                title: { $regex: ".*" + searched + ".*", $options: "i" },
              },
              { address: { $regex: ".*" + searched + ".*", $options: "i" } },
            ],
          },
        ],
      })
    );
  }
  return res.status(200).json(await Place.find({ active: true }));
};

const uploadImage = async (req, res) => {
  const uploadedFiles = [];
  for (let i in req.files) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = "." + parts[parts.length - 1];
    const newPath = path + ext;
    fs.renameSync(path, path + ext);
    if (newPath.includes("uploads\\")) {
      uploadedFiles.push(newPath.replace("uploads\\", ""));
    } else {
      uploadedFiles.push(newPath.replace("uploads/", ""));
    }
  }
  res.status(200).json(uploadedFiles);
};

const uploadImageByLink = async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownload.image({
    url: link,
    dest: path.join(__dirname, "../uploads/" + newName),
  });
  res.status(200).json(newName);
};

module.exports = {
  createAccomodation,
  removeAccomodation,
  getUserAccomodations,
  getSingleAccomodation,
  updateAccomodation,
  getSearchedAccomodations,
  uploadImage,
  uploadImageByLink,
};
