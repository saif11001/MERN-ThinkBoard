import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000
        }
    },
    {
        timestamps: true
    }
);

const Note = mongoose.model('note', noteSchema);

export default Note;