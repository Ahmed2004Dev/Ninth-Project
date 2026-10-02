import { ErrorEcxeption } from "../../../common/utils/response/errorHandling.js";
import { JWT } from "../../../config/config.serivce.js";
import jwt from 'jsonwebtoken';
import { notesModel } from './../../DB/models/notes.model.js';
import mongoose from "mongoose";

export const createNotes = async (token, inputs) => {
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
    const { title, content } = inputs
    const result = await notesModel.create({ title, content, userId })
    return result
}

export const Update = async (token, id, inputs) => {
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

    // التحقق من ملكية ال Notes
    const searchNote = await notesModel.findById(id);
    if (!searchNote) {
        return ErrorEcxeption({ message: "Note not Found", status: 404 })
    }
    if (searchNote.userId.toString() !== userId.toString()) {
        return ErrorEcxeption({ message: "You are not authorized to update this note", status: 403 });
    }

    // 2. استخراج البيانات من الـ Body 
    const { title, content } = inputs;
    let updateFields = {};
    if (title) updateFields.title = title;
    if (content) updateFields.content = content;

    // 5. تحديث البيانات في قاعدة البيانات
    const result = await notesModel.findByIdAndUpdate(
        id,        // نمرر الـ id مباشرة
        updateFields,  // الحقول الجديدة فقط
        { new: true }  // لإرجاع المستند بعد التعديل
    );

    return result;
};

export const Replacement = async (token, id, inputs) => {
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

    //2 التحقق من ملكية ال Notes
    const searchNote = await notesModel.findById(id);
    if (!searchNote) {
        return ErrorEcxeption({ message: "Note not Found", status: 404 })
    }
    if (searchNote.userId.toString() !== userId.toString()) {
        return ErrorEcxeption({ message: "You are not authorized to update this note", status: 403 });
    }

    // 3. استخراج البيانات من الـ Body 
    const { title, content } = inputs;
    let updateFields = {};
    if (title) updateFields.title = title;
    if (content) updateFields.content = content;

    // 4. تحديث البيانات في قاعدة البيانات
    const result = await notesModel.findOneAndReplace(
        { _id: id },        // نمرر الـ id مباشرة
        updateFields,  // الحقول الجديدة فقط
        { new: true }  // لإرجاع المستند بعد التعديل
    );

    return result;
};

export const ReplacAllTitile = async (token, newTitle) => {
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

    // 2. تحديث البيانات في قاعدة البيانات
    const { title } = newTitle;

    const result = await notesModel.updateMany(
        { userId: userId },
        {
            $set: { title: title }
        },
        {}  // لإرجاع المستند بعد التعديل
    );

    return result;
};

export const DeleteNote = async (token, noteID) => {
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
    const result = await notesModel.findOneAndDelete(noteID)
    return result
}

export const getNotesPaginate = async (token, query) => {
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

    // 2. قراءة page و limit وحساب الـ skip
    const page = parseInt(query?.page) || 1;
    const limit = parseInt(query?.limit) || 5;
    const skip = (page - 1) * limit;


    const result = await notesModel.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
    return result
}

export const getNoteByID = async (token, noteID) => {
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
    };

    if (!noteID) {
        return ErrorEcxeption({ message: "NoteID is required", status: 401 });
    }

    // التحقق من أن صاحب التوكين هو مالك الملاحظة

    const result = await notesModel.findById(noteID);
    if (result.userId.toString() !== userId.toString()) {
        return ErrorEcxeption({ message: "You are not authorized to view this note", status: 403 });
    }
    return result;
}

export const getNotByContent = async (token, query) => {
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
    };

    const { content } = query

    const result = await notesModel.findOne({
        userId: userId,
        content: { $regex: content, $options: "i" }
    });

    if (result.userId.toString() !== userId.toString()) {
        return ErrorEcxeption({ message: "You are not authorized to view this note", status: 403 });
    }

    return result
}

export const getWithJoin = async (token) => {
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
    };

    const result = await notesModel.find({ userId })
        .select('_id title userId createdAt')
        .populate({
            path: 'userId',
            select: 'emali -_id' // إرجاع الإيميل فقط بدون id المباشر للمستخدم
        });


    return result
}

export const getWithaggregation = async (token, query) => {
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
    };

    const targetUserId = new mongoose.Types.ObjectId(userId);
    // بناء شرط التصفية (Match condition)
    const matchCondition = {
        userId: targetUserId
    };
    // إذا أرسل المستخدم كلمة في الـ title يُضاف شرط البحث (باستخدام RegExp للبحث المرن)
    const { titleQuery } = query
    if (titleQuery) {
        matchCondition.title = { $regex: titleQuery, $options: 'i' };
    }
    const result = await notesModel.aggregate([
        {
            $match: matchCondition
        },
        {
            $lookup: {
                from: 'Users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userInfo' // اسم المصفوفة المؤقتة
            }
        },
        {
            // 3. بناء الهيكل المطلوب (title, userId, createdAt + user object يحتوي name و email)
            $project: {
                _id: 0,
                title: 1,
                userId: 1,
                createdAt: 1,
                Users: {
                    name: { $arrayElemAt: ['$userInfo.name', 0] },
                    emali: { $arrayElemAt: ['$userInfo.emali', 0] }
                }
            }
        }
    ])
    return result
}

export const DeleteAllNotes = async (token)=>{
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
    };

    const result = await notesModel.deleteMany({userId})
    return result
}