import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const saltRounds = 10; // 用于 bcrypt 的盐轮次
const secretKey = process.env.SECRET_KEY; // 从环境变量中读取密钥

// 加密密码
async function encryptPassword(password) {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        // console.error("Error encrypting password:", error);
        throw error;
    }
}

// 验证密码
async function validatePassword(password, hashedPassword) {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        // console.error("Error validating password:", error);
        throw error;
    }
}

// 生成 JWT 令牌
function generateToken(user) {
    const payload = { userId: user.userId, email: user.email };
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

// 验证 JWT 令牌
function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        // console.error("Error verifying token:", error);
        throw error;
    }
}

export { encryptPassword, validatePassword, generateToken, verifyToken };
