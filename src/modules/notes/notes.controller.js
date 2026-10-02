import { Router } from "express";
import { createNotes, DeleteAllNotes, DeleteNote, getNotByContent, getNoteByID, getNotesPaginate, getWithaggregation, getWithJoin, ReplacAllTitile, Replacement, Update } from './notes.service.js';
import { successResponse } from './../../../common/utils/response/success.respose.js';
const router = Router()

router.post("/", async (req, res, next) => {
    const result = await createNotes(req.headers.token, req.body);
    return successResponse({ res, message: "Note Created" })
});

router.patch("/all", async (req, res, next) => {
    const result = await ReplacAllTitile(req.headers.token, req.body);
    return successResponse({ res, message: "all titiles Updated", data: result })
})

router.get("/paginateNotes", async (req,res,next) => {
    const result = await getNotesPaginate(req.headers.token, req.query);
    return successResponse({ res, data: result })
});

router.get("/getByContent", async (req,res,next) => {
    const result = await getNotByContent(req.headers.token, req.query);
    return successResponse({ res, data: result })
});

router.get("/note-with-user", async (req,res,next) => {
    const result = await getWithJoin(req.headers.token);
    return successResponse({ res, data: result })
});

router.get("/aggregate", async (req,res,next) => {
    const result = await getWithaggregation(req.headers.token , req.query);
    return successResponse({ res, data: result })
});

router.delete("/deleteAllNotes", async (req,res,next) => {
    const result = await DeleteAllNotes(req.headers.token);
    return successResponse({ res, data: result })
});


router.patch("/:noteID", async (req, res, next) => {
    const result = await Update(req.headers.token, req.params.noteID, req.body);
    return successResponse({ res, message: "Note Created", data: result })
});

router.put("/replace/:noteID", async (req, res, next) => {
    const result = await Replacement(req.headers.token, req.params.noteID, req.body);
    return successResponse({ res, message: "Note Created", data: result })
});

router.delete("/delete/:noteID", async (req, res, next) => {
    const result = await DeleteNote(req.headers.token, req.params.noteID);
    return successResponse({ res, message: "Note Deleted", data: result })
});

router.get("/:id", async (req,res,next) => {
    const result = await getNoteByID(req.headers.token, req.params.id);
    return successResponse({ res, data: result })
});



export default router