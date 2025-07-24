import express from "express";
import { getUserList, getAllCode } from "../controller/homeController.js";
import {
  createNewUser,
  deleteUser,
  getUserById,
  getUserRole,
  updateUser,
} from "../controller/admin.js";
import { verifyToken } from "../services/verifyToken.js";
import multer from "multer";
import {
  createDoctor,
  createDoctorInfo,
  createDoctorMarkdown,
  getDoctorList,
} from "../controller/doctor.js";
import { login } from "../controller/user.js";
import { handlerUploadImage } from "../services/handlerUploadImage.js";
let router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });
let initWebRoutes = (app) => {
  router.post("/api/user/login", login);
  //doctor
  router.get("/api/doctors", getDoctorList);
  router.post("/api/create-doctor", upload.single("image"), createDoctor);
  router.post("/api/create-doctor-info", createDoctorInfo);
  router.post("/api/create-doctor-markdown", createDoctorMarkdown);

  //system
  router.get("/api/allcode", getAllCode);
  router.post("/api/admin/login", getUserRole);
  router.get("/api/users", verifyToken, getUserList);
  router.get("/api/users/:id", verifyToken, getUserById);
  router.post(
    "/api/create-user",
    verifyToken,
    upload.single("image"),
    createNewUser
  );
  router.put("/api/users/:id", verifyToken, upload.single("image"), updateUser);
  router.delete("/api/users/:id", verifyToken, deleteUser);

  //

  router.post(
    "/services/api/upload",
    verifyToken,
    upload.single("image"),
    handlerUploadImage
  );
  return app.use("/", router);
};

module.exports = initWebRoutes;
