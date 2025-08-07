import nodemailer from "nodemailer";
export const sendEmail = async (to: string, subject: string, text: string) => {
  console.log("Email user:", process.env.EMAIL_USER);
  console.log("Email pass:", process.env.EMAIL_PASS ? "Exists" : "Missing");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};
