import mongoose from "mongoose"

const usersSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        emali: {
            type: String,
            required: true,
            uniqe: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            validate: {
                validator: function (value) {
                    if (value < 18 || value > 60) {
                        return false
                    }

                    return true
                },
                message: "Age must be between 18 and 60"
            }
        },
    },
    {
        collection: "Users",
    }
)



export const userModel = mongoose.model("User", usersSchema)