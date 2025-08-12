import bcrypt from "bcrypt";

export const crypt = async (planepassword) => {
  const hash = await bcrypt.hash(planepassword, 10);
  return hash;
};

export const decrypt = async (planepassword, encryptpassword) => {
  return await bcrypt.compare(planepassword, encryptpassword);
};
