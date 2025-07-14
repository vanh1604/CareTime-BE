import { raw } from "body-parser";
import db from "../models";
import bcrypt from "bcrypt";
import {
  createUser,
  getAllUser,
  hashUserPassword,
} from "../services/crudService";

export const getUserList = async (req, res) => {
  try {
    let data = await getAllUser();
    return res.json({
      success: true,
      message: "successfully get user list",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};

export const postCRUD = async (req, res) => {
  let userdata = await createUser(req.body);

  return res.json({
    success: true,
    message: "successfully create user",
    data: userdata,
  });
};

export const putCRUD = async (req, res) => {
  let data = req.body;
  const { id } = req.params;
  if (!id) {
    return res.send("User not found!");
  }
  const userData = await db.User.update(data, { where: { id: id } });

  return res.json({
    success: true,
    message: "successfully edit user",
    data: userData,
  });
};

export const deleteCRUD = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.send("User not found!");
  }
  await db.User.destroy({ where: { id: id } });
  return res.json({
    success: true,
    message: "successfully delete user",
  });
};

export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing input parameter",
      });
    }
    let userData = await db.User.findOne({
      where: { email: email },
      raw: true,
    });
    if (!userData) {
      return res.status(401).json({
        success: false,
        message: "The uer is not exist please check again email",
      });
    }
    const isPasswordMatch = bcrypt.compareSync(password, userData.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Wrong password please check again",
      });
    }
    const { password: _, ...userWithoutPassword } = userData;
    return res.status(200).json({
      success: true,
      message: "Login successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
