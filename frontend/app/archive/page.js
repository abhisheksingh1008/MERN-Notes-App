"use client";

import { useContext, useState, useEffect } from "react";

import useNote from "@/hooks/useNote";
import classes from "@/styles/Notes.module.css";
import AuthContext from "@/store/auth-context";
import NoteItem from "@/components/NoteItem";
import { MdViewList } from "react-icons/md";
import { HiViewGrid } from "react-icons/hi";
import LoadingSpinner from "@/components/LoadingSpinner";
import toast from "react-hot-toast";

const Archive = () => {
  const authCtx = useContext(AuthContext);
  const noteHook = useNote();

  const [archivedNotes, setArchivedNotes] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchArchivedNotesByUserId = async () => {
    setIsError(false);
    setErrorMessage(null);
    setIsFetching(true);

    const response = await noteHook.fetchArchivedNotesByUserId();

    setIsFetching(false);

    if (response.success) {
      setArchivedNotes(response.archivedNotes);
    } else {
      setIsError(true);
      setErrorMessage(response.message);
    }
  };

  const deleteNoteHandler = (deletedNoteId) => {
    setArchivedNotes((prev) =>
      prev.filter((note) => note._id !== deletedNoteId)
    );
    toast.success("Note deleted!");
  };

  const togglePinHandler = (noteToToggle) => {
    const noteIndex = archivedNotes.findIndex(
      (note) => note._id === noteToToggle._id
    );

    let updatedNotes = [...archivedNotes];
    if (noteToToggle.isPinned) {
      updatedNotes[noteIndex] = { ...updatedNotes[noteIndex], isPinned: false };
      setArchivedNotes(updatedNotes);
    } else {
      updatedNotes[noteIndex] = { ...updatedNotes[noteIndex], isPinned: true };
      setArchivedNotes(updatedNotes);
    }
  };

  const unarchiveNoteHandler = (unarchivedNoteId) => {
    setArchivedNotes((prev) =>
      prev.filter((note) => note._id !== unarchivedNoteId)
    );
  };

  const showListView = async () => {
    await noteHook.showListView();
  };

  const showGridView = async () => {
    await noteHook.showGridView();
  };

  useEffect(() => {
    fetchArchivedNotesByUserId();
  }, []);

  const pinnedNotes = archivedNotes.filter((note) => note.isPinned);
  const unpinnedNotes = archivedNotes.filter((note) => !note.isPinned);

  return (
    <div className={classes["notes-page-container"]}>
      <section className={classes["notes-section"]}>
        <div className={classes.notes}>
          <div className={classes["notes-top"]}>
            <span className={classes["notes-heading"]}>Archive</span>
            <span className={classes["notes-ui-options"]}>
              <button
                className={
                  !authCtx.user?.prefersGridView
                    ? `${classes["notes-ui-option"]} ${classes.active}`
                    : classes["notes-ui-option"]
                }
                onClick={showListView}
              >
                <MdViewList className={classes["notes-ui-icon"]} />
              </button>
              <button
                className={
                  authCtx.user?.prefersGridView
                    ? `${classes["notes-ui-option"]} ${classes.active}`
                    : classes["notes-ui-option"]
                }
                onClick={showGridView}
              >
                <HiViewGrid className={classes["notes-ui-icon"]} />
              </button>
            </span>
          </div>
          {isFetching ? (
            <LoadingSpinner className={classes.loader} />
          ) : (
            archivedNotes.length > 0 && (
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
                    onToggleArchive={unarchiveNoteHandler}
                    onDelete={deleteNoteHandler}
                  />
                ))}
                {unpinnedNotes.map((note) => (
                  <NoteItem
                    key={note._id}
                    note={note}
                    onTogglePin={togglePinHandler}
                    onToggleArchive={unarchiveNoteHandler}
                    onDelete={deleteNoteHandler}
                  />
                ))}
              </ul>
            )
          )}
          {isError && (
            <div className={classes.error}>
              Something went wrong. Couldn't fetch notes. {errorMessage}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Archive;
