import express from "express";

import {
  getAllNotes,
  getNoteById,
  getNotesByUserId,
  getArchivedNotesByUserId,
  createNote,
  updateNote,
  deleteImage,
  deleteNote,
} from "../controllers/note-controllers.js";
import { requireSignIn, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/notes/user/:uid", requireSignIn, getNotesByUserId);
router.get("/notes/archive/user/:uid", requireSignIn, getArchivedNotesByUserId);
router.get("/notes/:noteId", getNoteById);
router.post("/notes", requireSignIn, createNote);
router.patch("/notes/:noteId", requireSignIn, updateNote);
router.patch("/notes/:noteId/delete-image", requireSignIn, deleteImage);
router.delete("/notes/:noteId", requireSignIn, deleteNote);
router.get("/notes", requireSignIn, admin, getAllNotes);

export default router;
