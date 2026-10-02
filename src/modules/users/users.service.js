import { ErrorEcxeption } from "../../../common/utils/response/errorHandling.js";
import { JWT, SECRETKEY } from "../../../config/config.serivce.js";
import { userModel } from "../../DB/models/users.model.js"
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";


export const signup = async (inputs) => {
    const { name, emali, password, phone, age } = inputs
    const checkUser = await userModel.findOne({ emali: emali });
    if (checkUser) {
        return ErrorEcxeption({ message: "Email aready exist", status: 409 })
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const secretKey = SECRETKEY || "MySecretKey123";
    const encryptedPhone = CryptoJS.AES.encrypt(phone, secretKey).toString();

    const result = await userModel.create([{ name, emali, password: hashedPassword, phone: encryptedPhone, age }])
    return result
}

export const login = async (inputs) => {
    const { emali, password } = inputs
    const checkUser = await userModel.findOne({ emali: emali });
    if (!checkUser) {
        return ErrorEcxeption({ message: "Invalid Email or Password", status: 404 })
    }

    const isPasswordMatch = bcrypt.compareSync(password, checkUser.password);
    if (!isPasswordMatch) {
        return ErrorEcxeption({ message: "Invalid Email or Password", status: 404 })
    }

    const token = jwt.sign(
        { userId: checkUser._id },
        JWT || "MyJwtSecret123",
        { expiresIn: "1h" }
    );

    return token
}

export const Update = async (token, inputs) => {
    // 1. التحقق من وجود الـ Token وفك تشفيره
    if (!token) {
        return ErrorEcxeption({ message: "Token is required", status: 401 });
    }
    let userId;
    try {
        // قراءة مفتاح الـ JWT من متغيرات البيئة process.env
        const secretKey = JWT || "MyJwtSecret123";
        const decoded = jwt.verify(token, secretKey);
        userId = decoded.userId; // استخراج الـ id المشفّر داخل التوكين
    } catch (error) {
        return ErrorEcxeption({ message: "Invalid or expired token", status: 401 });
    }
    // 2. استخراج البيانات من الـ Body 
    const { name, emali, phone, age, password } = inputs;

    // منع تحديث كلمة المرور عبر هذا المسار (حسب شروط الواجب)
    if (password) {
        return ErrorEcxeption({ message: "Cannot update password from this endpoint", status: 400 });
    }

    // 3. التثبت من أن الإيميل الجديد (إن وُجد) غير مستخدم من حساب آخر
    if (emali) {
        const isEmailExist = await userModel.findOne({ emali, _id: { $ne: userId } });
        if (isEmailExist) {
            return ErrorEcxeption({ message: "Email is already taken by another user", status: 409 });
        }
    }

    // 4. إعداد الحقول المراد تحديثها وتشفير رقم الهاتف إن وُجد
    let updateFields = {};
    if (name) updateFields.name = name;
    if (emali) updateFields.emali = emali;
    if (age) updateFields.age = age;

    if (phone) {
        const phoneSecretKey = SECRETKEY || "MySecretKey123";
        updateFields.phone = CryptoJS.AES.encrypt(phone, phoneSecretKey).toString();
    }

    // 5. تحديث البيانات في قاعدة البيانات
    const result = await userModel.findByIdAndUpdate(
        userId,        // نمرر الـ id مباشرة
        updateFields,  // الحقول الجديدة فقط
        { new: true }  // لإرجاع المستند بعد التعديل
    );

    return result;
};

export const Delete = async (token)=>{
    if (!token) {
        return ErrorEcxeption({ message: "Token is required", status: 401 });
    }
    let userId;
    try {
        // قراءة مفتاح الـ JWT من متغيرات البيئة process.env
        const secretKey = JWT || "MyJwtSecret123";
        const decoded = jwt.verify(token, secretKey);
        userId = decoded.userId; // استخراج الـ id المشفّر داخل التوكين
    } catch (error) {
        return ErrorEcxeption({ message: "Invalid or expired token", status: 401 });
    }

    const result = await userModel.deleteOne({_id:userId});
    return result
}

export const Get = async (token)=>{
    if (!token) {
        return ErrorEcxeption({ message: "Token is required", status: 401 });
    }
    let userId;
    try {
        // قراءة مفتاح الـ JWT من متغيرات البيئة process.env
        const secretKey = JWT || "MyJwtSecret123";
        const decoded = jwt.verify(token, secretKey);
        userId = decoded.userId; // استخراج الـ id المشفّر داخل التوكين
    } catch (error) {
        return ErrorEcxeption({ message: "Invalid or expired token", status: 401 });
    }

    const result = await userModel.findOne({_id:userId});
    return result
}