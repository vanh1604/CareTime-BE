import { raw } from "body-parser";
import db from "../models";

import { Op } from "sequelize";
export const getUserList = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const users = await db.User.findAll({
      where: {
        id: {
          [Op.ne]: currentUserId, // 🔥 bỏ người đăng nhập hiện tại
        },
        roleId: {
          [Op.or]: ["R1", "R3"],
        },
      },
      raw: true,
    });

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách người dùng",
    });
  }
};

export const getAllCode = async (req, res) => {
  try {
    const { type } = req.query;
    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Missing input parameter",
      });
    }
    let data = await db.allCode.findAll({ where: { type } }, { raw: true });
    return res.json({
      success: true,
      message: "successfully get all code",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
