"use client";

import { useRouter, usePathname } from "next/navigation";
import useNote from "@/hooks/useNote";
import classes from "@/styles/NoteItem.module.css";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { LuPin, LuPinOff } from "react-icons/lu";
import { BiArchiveIn, BiArchiveOut } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { LuEdit } from "react-icons/lu";
import Link from "next/link";

const NoteItem = ({ note, onTogglePin, onToggleArchive, onDelete }) => {
  const noteHook = useNote();

  const router = useRouter();
  const pathname = usePathname();

  const updateNoteHandler = async (updatedNote) => {
    const response = await noteHook.updateNote(note._id, updatedNote);
  };

  const deleteNoteHandler = async () => {
    onDelete(note._id);
    const response = await noteHook.deleteNote(note._id);
  };

  return (
    <li className={classes.note}>
      <div className={classes["more-options"]}>
        <CgMoreVerticalAlt className={classes["more-options-icon"]} />
        <ul className={classes["more-options-list"]}>
          <li>
            <button
              onClick={() => {
                onTogglePin(note);
                updateNoteHandler({ ...note, isPinned: !note.isPinned });
              }}
            >
              <span className={classes["button-icon"]}>
                {note.isPinned ? <LuPinOff /> : <LuPin />}
              </span>
              <span className={classes["button-text"]}>
                {note.isPinned ? "Unpin" : "Pin"}
              </span>
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                onToggleArchive(note._id);
                updateNoteHandler({ ...note, archive: !note.archive });
              }}
            >
              <span className={classes["button-icon"]}>
                {note.archive ? <BiArchiveOut /> : <BiArchiveIn />}
              </span>
              <span className={classes["button-text"]}>
                {note.archive ? "Unarchive" : "Archive"}
              </span>
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                router.push(`notes/${note._id}`);
              }}
            >
              <span className={classes["button-icon"]}>
                <LuEdit />
              </span>
              <span className={classes["button-text"]}>Edit</span>
            </button>
          </li>
          <li>
            <button onClick={deleteNoteHandler}>
              <span className={classes["button-icon"]}>
                <MdDelete />
              </span>
              <span className={classes["button-text"]}>Delete</span>
            </button>
          </li>
        </ul>
      </div>
      <Link href={`notes/${note._id}`}>
        <div className={classes["note-title"]}>{note.title}</div>
        <div className={classes["note-description"]}>
          {note.description.substring(0, 95)}
          {note.description?.length > 95 && <span>...</span>}
        </div>
      </Link>
    </li>
  );
};

export default NoteItem;
