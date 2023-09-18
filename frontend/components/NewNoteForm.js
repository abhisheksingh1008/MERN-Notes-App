"use client";

import { useCallback, useState } from "react";

import classes from "@/styles/Form.module.css";
import buttonClasses from "@/styles/Button.module.css";

const defaultNoteFormData = {
  title: "",
  description: "",
  isError: false,
  errorMessage: null,
};

const NewNoteForm = ({ onAddNewNote, toggleFormVisibility }) => {
  const [formData, setFormData] = useState(defaultNoteFormData);

  const inputChangeHandler = (event) => {
    setFormData((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  };

  const cancelBtnHandler = useCallback(() => {
    toggleFormVisibility(false);
  }, [toggleFormVisibility]);

  const addBtnHandler = async (event) => {
    event.preventDefault();

    if (formData.title.trim().length === 0) {
      setFormData((prev) => {
        return {
          ...prev,
          isError: true,
          errorMessage: "Title cannot be empty.",
        };
      });
      return;
    }

    if (formData.description.trim().length === 0) {
      setFormData((prev) => {
        return {
          ...prev,
          isError: true,
          errorMessage: "Description cannot be empty.",
        };
      });
      return;
    }

    setFormData((prev) => {
      return {
        ...prev,
        isError: false,
        errorMessage: null,
      };
    });

    const response = await onAddNewNote({
      title: formData.title,
      description: formData.description,
    });

    if (!response.success) {
      setFormData((prev) => {
        return {
          ...prev,
          isError: true,
          errorMessage: response.message,
        };
      });
      return;
    }

    setFormData(defaultNoteFormData);
    toggleFormVisibility(false);
  };

  return (
    <form onSubmit={addBtnHandler}>
      <div className={classes["form-controls"]}>
        <div className={classes["form-control"]}>
          <label htmlFor="title">Title :</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={inputChangeHandler}
            required
          />
        </div>
        <div className={classes["form-control"]}>
          <label htmlFor="description">Description :</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={inputChangeHandler}
          ></textarea>
        </div>
      </div>
      <div className={classes["form-actions"]}>
        <button
          type="submit"
          className={`${classes["form-action"]} ${buttonClasses.button}`}
        >
          Add
        </button>
        <button
          type="button"
          onClick={cancelBtnHandler}
          className={`${classes["form-action"]} ${buttonClasses.button}`}
        >
          Cancel
        </button>
      </div>
      {formData.isError && (
        <div className={classes.error}>{formData.errorMessage}</div>
      )}
    </form>
  );
};

export default NewNoteForm;
