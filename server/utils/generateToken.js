import jwt from "jsonwebtoken";

const generateToken = (res, _id) => {
  const token = jwt.sign({ _id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "3d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;
