import express from "express";
import { PORT } from "../config/config.serivce.js";
import { notesRouter, usersRouter } from "./modules/index.js";
import { authiticationDB } from "./DB/connectDB.js";



const bootstrap = async () => {
    // Run Express
    const app = express();
    app.use(express.json());

    // Connect DB
    await authiticationDB()

    // Routing
    app.use("/users", usersRouter);
    app.use("/notes", notesRouter);


    app.use((error, req, res, next) => {
        const status = error?.cause?.status ?? 500;
        return res.status(status).json({ massage: error.massage || "Somthing went error", stack: error.stack })
    })
    app.use('{/*dummy}', (req, res) => { return res.status(404).json({ Massage: "Invalid routing please try again" }) });

    app.listen(PORT, () => { console.log(`The server in working in PORT number ${PORT}`); })
}
export default bootstrap





