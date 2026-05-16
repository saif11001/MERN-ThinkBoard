import mongoose from 'mongoose';
import Note from '../models/note.model.js'

export const getNote = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.noteId)) {
            return res.status(400).json({ success: false, message: "Invalid note ID" });
        }
        const noteId = req.params.noteId;

        const note = await Note.findById(noteId);
        if(!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        res.status(200).json({ success: true, data: note })
    } catch (error) {
        next(error);
    }
}

export const getNotes = async (req, res, next) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: notes.length, data: notes });
    } catch (error) {
        next(error);
    }
}

export const createNote = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        if (!title?.trim() || !content?.trim()) {
            return res.status(404).json({ success: false, message: "Title and content are required" });
        }
        
        const note = new Note({ title, content });
        await note.save();
        
        res.status(201).json({ success: true, message: "Note created successfully", data: note });
    } catch (error) {
        next(error);
    }
}

export const updateNote = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.noteId)) {
            return res.status(404).json({ success: false, message: "Invalid note ID" });
        }
        const noteId = req.params.noteId;
        const { title, content } = req.body || {};
        
        const note = await Note.findById(noteId);
        if(!note) {
            return res.status(404).json({ success: false, message: "Note not found"});
        }

        if(title !== undefined) note.title = title;
        if(content !== undefined) note.content = content;

        await note.save();
        res.status(200).json({ success: true, message: "Note updated successfully", data: note });
    } catch (error) {
        next(error);
    }
}

export const deleteNote = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.noteId)) {
            return res.status(404).json({ success: false, message: "Invalid note ID" });
        }
        const noteId = req.params.noteId;

        const note = await Note.findByIdAndDelete(noteId);
        if(!note) {
            return res.status(404).json({ success: false, message: "Note not found"});
        }
        
        res.status(200).json({ success: true, data: note });
    } catch (error) {
        next(error);
    }
}
