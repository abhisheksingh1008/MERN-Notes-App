"use client";

import { useState } from "react";

import NewNoteForm from "./NewNoteForm";
import buttonClasses from "@/styles/Button.module.css";

const AddNote = ({ onAddNewNote }) => {
  const [showForm, setShowForm] = useState(false);

  const addNoteHandler = () => {
    setShowForm(true);
  };

  return (
    <>
      {!showForm ? (
        <button onClick={addNoteHandler} className={buttonClasses.button}>
          New note
        </button>
      ) : (
        <NewNoteForm
          onAddNewNote={onAddNewNote}
          toggleFormVisibility={setShowForm}
        />
      )}
    </>
  );
};

export default AddNote;
