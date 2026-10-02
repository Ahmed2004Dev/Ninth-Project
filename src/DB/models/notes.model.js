import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            validate: {
                validator: function (value) {
                    if (value == value.toUpperCase()) {
                        return false
                    }
                    return true
                },
                message: "Title cannot be entirely uppercase"
            }
        },
        content: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    {
        collection: "Notes",
        timestamps: true
    }
)



export const notesModel = mongoose.model("Note", notesSchema)