import express from "express";
import {
  postCRUD,
  putCRUD,
  deleteCRUD,
  getUserList,
  handleLogin,
} from "../controller/homeController.js";

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/api/users", getUserList);
  router.post("/post-crud", postCRUD);
  router.put("/api/users/:id", putCRUD);
  router.delete("/api/users/:id", deleteCRUD);
  router.post("/api/login", handleLogin);
  return app.use("/", router);
};

module.exports = initWebRoutes;
