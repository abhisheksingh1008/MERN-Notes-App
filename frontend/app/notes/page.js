"use client";

import { useContext, useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import useNote from "@/hooks/useNote";
import AuthContext from "@/store/auth-context";
import NoteItem from "@/components/NoteItem";
import classes from "@/styles/Notes.module.css";
import buttonClasses from "@/styles/Button.module.css";
import Card from "@/components/Card";
import { MdViewList } from "react-icons/md";
import { HiViewGrid } from "react-icons/hi";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";

const Notes = () => {
  const authCtx = useContext(AuthContext);
  const router = useRouter();

  if (!authCtx.user) {
    router.push("/");
    return;
  }

  const noteHook = useNote();

  const [notes, setNotes] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchNotesByUserId = async () => {
    setNotes([]);
    setIsError(false);
    setErrorMessage(null);
    setIsFetching(true);

    const notesData = await noteHook.fetchNotesByUserId();

    setIsFetching(false);

    if (notesData.success) {
      setNotes(notesData.notes);
    } else {
      setIsError(true);
      setErrorMessage(notesData.message);
    }
  };

  const deleteNoteHandler = (deletedNoteId) => {
    setNotes((prev) => prev.filter((note) => note._id !== deletedNoteId));
    toast.success("Note deleted.");
  };

  const togglePinHandler = (noteToToggle) => {
    const noteIndex = notes.findIndex((note) => note._id === noteToToggle._id);

    let updatedNotes = [...notes];
    // updatedNotes[noteIndex] = {
    //   ...updatedNotes[noteIndex],
    //   isPinned: !updatedNotes[noteIndex].isPinned,
    // };
    if (noteToToggle.isPinned) {
      updatedNotes[noteIndex] = { ...updatedNotes[noteIndex], isPinned: false };
      setNotes(updatedNotes);
    } else {
      updatedNotes[noteIndex] = { ...updatedNotes[noteIndex], isPinned: true };
      setNotes(updatedNotes);
    }
  };

  const archiveNoteHandler = (archivedNoteId) => {
    setNotes((prev) => prev.filter((note) => note._id !== archivedNoteId));
  };

  const listViewHandler = async () => {
    await noteHook.showListView();
  };

  const gridViewHandler = async () => {
    await noteHook.showGridView();
  };

  useEffect(() => {
    fetchNotesByUserId();
  }, []);

  const pinnedNotes = notes.filter((note) => note.isPinned);
  const unpinnedNotes = notes.filter((note) => !note.isPinned);

  return (
    <div className={classes["notes-page-container"]}>
      <section>
        <Card className={classes["form-card"]}>
          <Link href={"/new-note"}>
            <button className={buttonClasses.button}>New Note</button>
          </Link>
        </Card>
      </section>
      <section className={classes["notes-section"]}>
        <div className={classes.notes}>
          <div className={classes["notes-top"]}>
            <span className={classes["notes-heading"]}>Your notes</span>
            <span className={classes["notes-ui-options"]}>
              <button
                className={
                  !authCtx.user?.prefersGridView
                    ? `${classes["notes-ui-option"]} ${classes.active}`
                    : classes["notes-ui-option"]
                }
                onClick={listViewHandler}
              >
                <MdViewList className={classes["notes-ui-icon"]} />
              </button>
              <button
                className={
                  authCtx.user?.prefersGridView
                    ? `${classes["notes-ui-option"]} ${classes.active}`
                    : classes["notes-ui-option"]
                }
                onClick={gridViewHandler}
              >
                <HiViewGrid className={classes["notes-ui-icon"]} />
              </button>
            </span>
          </div>
          {isFetching ? (
            <LoadingSpinner className={classes.loader} />
          ) : isError ? (
            <div className={classes.error}>
              Something went wrong. Couldn't fetch notes. {errorMessage}
            </div>
          ) : notes.length > 0 ? (
            <ul
              className={
                !authCtx.user?.prefersGridView
                  ? `${classes["notes-list"]}`
                  : `${classes["notes-list"]} ${classes["grid-view"]}`
              }
            >
              {pinnedNotes.map((note) => (
                <NoteItem
                  key={note._id}
                  note={note}
                  onTogglePin={togglePinHandler}
                  onToggleArchive={archiveNoteHandler}
                  onDelete={deleteNoteHandler}
                />
              ))}
              {unpinnedNotes.map((note) => (
                <NoteItem
                  key={note._id}
                  note={note}
                  onTogglePin={togglePinHandler}
                  onToggleArchive={archiveNoteHandler}
                  onDelete={deleteNoteHandler}
                />
              ))}
            </ul>
          ) : (
            <div style={{ textAlign: "center" }}>
              No notes here,{" "}
              <Link
                href={"/new-note"}
                style={{ color: "blue", textDecoration: "underline" }}
              >
                add one.
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Notes;
