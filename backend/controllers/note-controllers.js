import Note from "../models/noteModel.js";
import HttpError from "../models/http-error.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

const getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find();
    if (!notes) {
      return next(
        new HttpError(
          "There are no notes in the database. Try creating some.",
          400
        )
      );
    }
    res.status(200).json({
      success: true,
      message: "Notes fetched successfully!",
      notes,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Could not get notes.", 500));
  }
};

const getNotesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  try {
    const notes = await Note.find({ creator: userId, archive: false }).sort({
      createdAt: -1,
    });

    if (!notes) {
      return next(
        new HttpError("Could not find any notes for the provided user id", 400)
      );
    }

    res.status(200).json({
      success: true,
      message: "Notes fetched successfully!",
      notes: notes,
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(
        "Something went wrong, could not get notes for the provided user id.",
        500
      )
    );
  }
};

const getArchivedNotesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  try {
    const archivedNotes = await Note.find({
      creator: userId,
      archive: true,
    }).sort({ createdAt: -1 });

    if (!archivedNotes) {
      return next(
        new HttpError("Could not find any notes for the provided user id", 400)
      );
    }

    res.status(200).json({
      success: true,
      message: "Notes fetched successfully!",
      archivedNotes: archivedNotes,
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError(
        "Something went wrong, could not get notes for the provided user id.",
        500
      )
    );
  }
};

const getNoteById = async (req, res, next) => {
  const noteId = req.params.noteId;

  try {
    const note = await Note.findById(noteId);

    if (!note) {
      return next(
        new HttpError("Could not find any note with the provided id.", 400)
      );
    }

    res.status(200).json({
      success: true,
      message: "Note fetched successfully!",
      note,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Could not get notes.", 500));
  }
};

const createNote = async (req, res, next) => {
  const { title, description, images } = req.body;

  try {
    const createdNote = new Note({
      title,
      description,
      images,
      creator: req.user,
    });

    await createdNote.save();

    const user = await User.findById(req.user._id);
    user.notes.push(createdNote);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Note created successfully!",
      note: createdNote,
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Failed to create note. Please try again", 500));
  }
};

const updateNote = async (req, res, next) => {
  const noteId = req.params.noteId;
  const { title, description, images, isPinned, archive } = req.body;

  try {
    let note = await Note.findById(noteId);

    if (!note) {
      return next(
        new HttpError("Could not find any note with the provided id.", 400)
      );
    }

    if (!(note.creator._id.toString() === req.user._id.toString())) {
      return next(
        new HttpError(
          "Only the creator of a note can update or delete it.",
          401
        )
      );
    }

    note.title = title || note.title;
    note.description = description || note.description;
    note.images = images || note.images;
    note.isPinned = isPinned !== undefined ? isPinned : note.isPinned;
    note.archive = archive !== undefined ? archive : note.archive;

    await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully!",
      note,
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Something went wrong, could not update note.", 500)
    );
  }
};

const deleteImage = async (req, res, next) => {
  const noteId = req.params.noteId;

  try {
    let note = await Note.findById(noteId);

    if (!note) {
      return next(
        new HttpError("Could not find any note with the provided id.", 500)
      );
    }

    if (!(note.creator._id.toString() === req.user._id.toString())) {
      return next(
        new HttpError(
          "Only the creator of a note can update or delete it.",
          401
        )
      );
    }

    const { imageData } = req.body;

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    await cloudinary.uploader
      .destroy(imageData.public_id, (err, res) => {
        // console.log(err, res);
      })
      .then(async (response) => {
        // console.log(response);

        note.images.pull({ image_url: imageData.image_url });
        await note.save();

        note = await Note.findById(note._id);

        res.status(200).json({
          success: true,
          message: "Image removed!",
          note,
        });
      })
      .catch((err) => {
        console.log(err);

        res.status(200).json({
          success: false,
          message: "Something went wrong, failed to delete image.",
        });
      });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Something went wrong, could not delete note.", 500)
    );
  }
};

const deleteNote = async (req, res, next) => {
  const noteId = req.params.noteId;

  try {
    const note = await Note.findById(noteId).populate("creator");

    if (!note) {
      return next(
        new HttpError("Could not find any note with the provided id.", 500)
      );
    }

    if (!(note.creator._id.toString() === req.user._id.toString())) {
      return next(
        new HttpError(
          "Only the creator of a note can update or delete it.",
          401
        )
      );
    }

    for (let i = 0; i < note.images.length; i++) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      await cloudinary.uploader
        .destroy(note.images[i].public_id, (err, res) => {
          // console.log(err, res);
        })
        .then((res) => {
          // console.log(res)
        })
        .catch((err) => {
          console.log(err);
        });
    }

    await Note.deleteOne({ _id: note._id });
    note.creator.notes.pull(note);
    await note.creator.save();

    res.status(200).json({
      success: true,
      message: "Note deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Something went wrong, could not delete note.", 500)
    );
  }
};

export {
  getAllNotes,
  getNoteById,
  getNotesByUserId,
  getArchivedNotesByUserId,
  createNote,
  updateNote,
  deleteImage,
  deleteNote,
};
