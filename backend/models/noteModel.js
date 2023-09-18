import mongoose from "mongoose";

const image = mongoose.Schema({
  image_url: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
});

const noteSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [image],
    creator: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isPinned: {
      type: Boolean,
      required: true,
      default: false,
    },
    archive: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
