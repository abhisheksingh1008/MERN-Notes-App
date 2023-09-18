"use client";

import { useState, useEffect, useRef } from "react";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import useNote from "@/hooks/useNote";
import classes from "@/styles/Form.module.css";
import style from "@/styles/UpdateNote.module.css";
import buttonClasses from "@/styles/Button.module.css";
import LoadingSpinner from "@/components/LoadingSpinner";

const initialNoteState = {
  title: "",
  description: "",
  image: null,
};

const handleFileUpload = async (filetype, file) => {
  if (!file) return;
  if (!filetype) filetype = "auto";

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${filetype}/upload`;

  let formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "notes_app_images_preset");

  const response = await fetch(cloudinaryUrl, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to upload file.");
  }

  const { secure_url, public_id } = data;

  return { image_url: secure_url, public_id };
};

const NewNotePage = () => {
  const noteHook = useNote();
  const router = useRouter();

  const [note, setNote] = useState(initialNoteState);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const textAreaRef = useRef(null);

  const createNewNote = async (e) => {
    e.preventDefault();

    if (
      note.title.trim().length === 0 ||
      note.description.trim().length === 0
    ) {
      toast.error("Please fill all the required fields.");
      return;
    }

    setIsLoading(true);

    let imageData;
    if (file && fileURL) {
      try {
        imageData = await handleFileUpload("image", file);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong, failed to create note.");
        return;
      }
    }

    const newNote = await noteHook.addNewNote({
      title: note.title.trim(),
      description: note.description.trim(),
      images: imageData ? [imageData] : [],
    });

    setIsLoading(false);

    if (!newNote) {
      toast.error("Something went wrong, failed to create note.");
      return;
    } else {
      toast.success("New note added!");
    }

    router.replace("/notes");
  };

  const inputChangeHandler = (event) => {
    setNote((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  };

  const handleTextareaResize = () => {
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
  };

  return (
    <div className={style["update-note-canvas"]} style={{ margin: "1rem 0" }}>
      <form onSubmit={createNewNote}>
        <div className={classes["form-controls"]}>
          <div className={classes["form-control"]}>
            <label htmlFor="description">Title* : </label>
            <input
              type="text"
              id="title"
              name="title"
              value={note.title}
              onChange={inputChangeHandler}
              placeholder={"Title"}
              required
            />
          </div>
          <div className={classes["form-control"]}>
            <label htmlFor="description">Description* : </label>
            <textarea
              name="description"
              id="description"
              value={note.description}
              placeholder={"Description"}
              ref={textAreaRef}
              required
              onChange={(e) => {
                inputChangeHandler(e);
                handleTextareaResize();
              }}
            ></textarea>
          </div>
          <div className={classes["form-control"]}>
            <label htmlFor="description">Add an image : </label>
            <input
              name="image"
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setFileURL(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>
          {file && (
            <div className={style["image-preview-container"]}>
              <img src={fileURL} className={style.image} />
            </div>
          )}
          <div className={classes["form-actions"]}>
            <button
              type="submit"
              disabled={isLoading}
              className={`${classes["form-action"]} ${buttonClasses.button}`}
            >
              {isLoading ? <LoadingSpinner /> : "Create"}
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                router.back();
              }}
              className={`${classes["form-action"]} ${buttonClasses.button}`}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewNotePage;
