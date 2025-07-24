import db from "../models";
import bcrypt from "bcrypt";
import fs from "fs";
import { hashUserPassword } from "../services/crudService";
export const getDoctorList = async (req, res) => {
  try {
    const doctors = await db.User.findAll({
      where: { roleId: "R2" },
      limit: 10,
      order: [["createdAt", "DESC"]],
      atributes: { exclude: ["password"] },
      include: [
        {
          model: db.allCode,
          as: "roleData",
          attributes: ["type", "valueEn", "valueVi"],
        },
        {
          model: db.allCode,
          as: "positionData",
          attributes: ["type", "valueEn", "valueVi"],
        },
        {
          model: db.DoctorInfo,
          as: "doctorInfoData",
          attributes: [
            "priceId",
            "paymentId",
            "provinceId",
            "yearsOfExperience",
            "addressClinic",
            "nameClinic",
            "isOnline",
          ],
          include: [
            {
              model: db.allCode,
              as: "priceData",
              attributes: ["type", "valueEn", "valueVi"],
            },
            {
              model: db.allCode,
              as: "paymentData",
              attributes: ["type", "valueEn", "valueVi"],
            },
            {
              model: db.allCode,
              as: "provinceData",
              attributes: ["type", "valueEn", "valueVi"],
            },
          ],
        },
        {
          model: db.Markdown,
          as: "markdownData",
          attributes: [
            "biography",
            "education",
            "achievements",
            "certifications",
            "researchPapers",
          ],
        },
      ],
    });
    return res.status(200).json({
      success: true,
      message: "Successfully get doctor list",
      data: doctors,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const data = req.body;
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

export const createDoctorInfo = async (req, res) => {
  try {
    const data = req.body;
    const doctorId = data.doctorId;

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Missing doctorId",
      });
    }

    const existed = await db.DoctorInfo.findOne({ where: { doctorId } });

    const doctorInfoData = {
      paymentId: data.paymentId,
      priceId: data.priceId,
      provinceId: data.provinceId,
      yearsOfExperience: data.yearsOfExperience,
      addressClinic: data.addressClinic,
      nameClinic: data.nameClinic,
      isOnline: data.isOnline,
    };

    if (existed) {
      await db.DoctorInfo.update(doctorInfoData, { where: { doctorId } });
    } else {
      await db.DoctorInfo.create({ ...doctorInfoData, doctorId });
    }

    return res.status(200).json({
      success: true,
      message: "Lưu thông tin chuyên môn thành công",
    });
  } catch (error) {
    console.error("🔥 Error saving doctor info:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lưu thông tin chuyên môn",
      error: error.message,
    });
  }
};

export const createDoctorMarkdown = async (req, res) => {
  try {
    const {
      doctorId,
      biography,
      education,
      achievements,
      certifications,
      researchPapers,
      specialtyId,
      clinicId,
      description,
    } = req.body;
    const existed = await db.Markdown.findOne({ where: { doctorId } });
    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu mã bác sĩ (doctorId)",
      });
    }
    if (existed) {
      await db.Markdown.update(
        {
          biography,
          education,
          achievements,
          certifications,
          researchPapers,
          specialtyId,
          clinicId,
          description,
        },
        { where: { doctorId } }
      );
    } else {
      await db.Markdown.create({
        doctorId,
        biography,
        education,
        achievements,
        certifications,
        researchPapers,
        specialtyId,
        clinicId,
        description,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Lưu thông tin chi tiết chuyên môn",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lưu thông tin chi tiết chuyên môn",
      error: error.message,
    });
  }
};
