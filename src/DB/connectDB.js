import mongoose from "mongoose";
import { URI } from "../../config/config.serivce.js";

export const authiticationDB = async () => {
    try {
        const DBconnectResult = await mongoose.connect(URI);
        console.log("Connect DB successfuly");
    } catch (error) {
        console.log(error);
        console.log("Fail To Connect DB");

    }

}