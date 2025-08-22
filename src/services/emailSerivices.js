import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendVerificationEmail(to, code) {
    await transporter.sendMail({
        from: `"My App" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Your Verification Code',
        text: `Your code is: ${code}`,
    });
}
