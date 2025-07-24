import bcrypt from "bcrypt";
import db from "../models";
import fs from "fs";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { createUser, hashUserPassword } from "../services/crudService";
const salt = bcrypt.genSaltSync(10);
export const getUserRole = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing email or password",
      });
    }

    const user = await db.User.findOne({
      where: { email },
      include: [
        {
          model: db.allCode,
          as: "roleData",
          attributes: ["key", "type", "valueEn", "valueVi"],
        },
      ],
      raw: true,
      nest: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Wrong password, please check again",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        roleId: user.roleId,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: "Login successfully",
      data: {
        ...userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createNewUser = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    if (!data.password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }
    let hashPassword = await hashUserPassword(data.password);
    const newUser = await db.User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      address: data.address,
      gender: data.gender,
      roleId: data.roleId,
      password: hashPassword,
      phoneNumber: data.phoneNumber,
      positionId: data.positionId,
      image: data.image,
    });

    return res.status(200).json({
      success: true,
      message: "Successfully created user",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    let { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Missing input parameter",
      });
    } else {
      let data = await db.User.findOne({
        where: { id: id },
        raw: true,
        attributes: { exclude: ["password"] },
      });
      return res.json({
        success: true,
        message: "successfully get user by id",
        data: data,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const user = await db.User.findOne({ where: { id } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    const updateData = { ...data };

    // Nếu có mật khẩu mới → kiểm tra
    if (data.password) {
      const isSame = bcrypt.compareSync(data.password, user.password);
      if (isSame) {
        return res.status(400).json({
          success: false,
          message: "Mật khẩu mới không được trùng với mật khẩu cũ",
        });
      }

      updateData.password = await hashUserPassword(data.password);
    } else {
      // Nếu không có password thì không gửi lên DB
      delete updateData.password;
    }

    await db.User.update(updateData, { where: { id } });

    return res.status(200).json({
      success: true,
      message: "Cập nhật người dùng thành công",
    });
  } catch (error) {
    console.error("❌ updateUser error:", error);
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi cập nhật người dùng",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.send("User not found!");
  }
  await db.User.destroy({ where: { id: id } });
  await db.Markdown.destroy({ where: { doctorId: id } });
  await db.DoctorInfo.destroy({ where: { doctorId: id } });
  return res.json({
    success: true,
    message: "successfully delete user",
  });
};
