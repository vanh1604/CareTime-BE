import e from "express";
import db from "../models/index";
import bcrypt from "bcrypt";

const salt = bcrypt.genSaltSync(10);
export const createUser = async (data) => {
  try {
    let hashPassword = await hashUserPassword(data.password);
    await db.User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      address: data.address,
      gender: data.gender === "1" ? true : false,
      roleId: data.roleId,
      password: hashPassword,
      phoneNumber: data.phoneNumber,
    });
  } catch (error) {
    console.log(error);
  }
};

export const hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllUser = async () => {
  try {
    return await db.User.findAll({
      raw: true,
    });
  } catch (error) {
    console.log(error);
  }
};
