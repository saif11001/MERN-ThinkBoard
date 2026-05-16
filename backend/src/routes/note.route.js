import express from 'express';
import { createNote, deleteNote, updateNote, getNote, getNotes } from '../controllers/note.controller.js';

const router = express.Router();

router.get('/:noteId', getNote);

router.get('/', getNotes);

router.post('/', createNote);

router.patch('/:noteId', updateNote);

router.delete('/:noteId', deleteNote);

export default router;