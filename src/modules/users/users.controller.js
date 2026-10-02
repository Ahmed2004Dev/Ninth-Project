import { Router } from "express";
import { Delete, Get, login, signup, Update } from "./users.service.js";
import { successResponse } from './../../../common/utils/response/success.respose.js';
const router = Router()

router.post("/signup" , async (req,res,next)=>{
    const result = await signup(req.body);
    return successResponse({res , message:"User Added Successfully ", status:201 , data:result})
})

router.post("/login" , async (req,res,next)=>{
    const result = await login(req.body);
    return successResponse({res , message:"Login Successfully ", status:201 , data:result})
})

router.patch("/update" , async (req,res,next)=>{
    const result = await Update(req.headers.token , req.body);
    return successResponse({res , message:"Update Successfully ", status:201 , data:result})
})

router.delete("/delete" , async (req,res,next)=>{
    const result = await Delete(req.headers.token);
    return successResponse({res , message:"Delete Successfully ", status:201 , data:result})
})

router.get("/profile" , async (req,res,next)=>{
    const result = await Get(req.headers.token);
    return successResponse({res , message:"Get Profile Successfully ", status:201 , data:result})
})

export default router