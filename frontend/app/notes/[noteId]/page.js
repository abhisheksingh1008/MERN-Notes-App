"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import useNote from "@/hooks/useNote";
import classes from "@/styles/Form.module.css";
import buttonClasses from "@/styles/Button.module.css";
import style from "@/styles/UpdateNote.module.css";
import { LuPin, LuPinOff } from "react-icons/lu";
import { BiArchiveIn, BiArchiveOut } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { TfiSave } from "react-icons/tfi";
import { LuEdit } from "react-icons/lu";
import { IoArrowBack } from "react-icons/io5";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import NoteImageItem from "@/components/NoteImageItem";

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

const EditNote = ({ params }) => {
  const noteHook = useNote();
  const router = useRouter();

  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    isError: false,
    errorMessage: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const textAreaRef = useRef(null);

  const fetchNoteById = async () => {
    setError({ isError: false, errorMessage: null });
    setIsLoading(true);

    const response = await noteHook.fetchNoteById(params.noteId);

    setIsLoading(false);

    if (response.success) {
      setNote(response.note);
    } else {
      setError({ isError: true, errorMessage: response.message });
      toast.error(response.message);
    }
  };

  const updateNoteHandler = async (newNoteData) => {
    setError({ isError: false, errorMessage: null });

    setIsUpdating(true);

    let imageData;
    if (file && fileURL) {
      try {
        imageData = await handleFileUpload("image", file);
      } catch (error) {
        console.log(error);
        setError({ isError: true, errorMessage: error?.message });
        return;
      }
    }

    if (imageData) {
      newNoteData?.images?.push(imageData);
    }

    const response = await noteHook.updateNote(note._id, newNoteData);

    setIsUpdating(false);

    if (response.success) {
      setNote(response.note);
      toast.success("Note updated.");
    } else {
      setError({ isError: true, errorMessage: response.message });
      toast.error(response.message);
    }

    setFile(null);
    setFileURL(null);
  };

  const onDeleteImage = (note) => {
    setNote(note);
  };

  const deleteNoteHandler = async () => {
    setIsUpdating(true);
    const response = await noteHook.deleteNote(params.noteId);
    setIsUpdating(false);

    if (response.success) {
      toast.success("Note deleted.");
      router.back();
    } else {
      setError({ isError: true, errorMessage: response.message });
    }

    router.replace("/notes");
  };

  useEffect(() => {
    fetchNoteById();
  }, []);

  useEffect(() => {
    if (isEditing) {
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
  }, [isEditing]);

  const inputChangeHandler = (event) => {
    setNote((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  };

  const handleTextareaResize = () => {
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
  };

  return (
    <div className={style["update-note-canvas"]}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        note && (
          <>
            <div className={style["update-options"]}>
              <span className={style["update-options-left"]}>
                <IoArrowBack
                  style={{
                    fontSize: "1.5rem",
                    marginRight: "0.25rem",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    router.back();
                  }}
                />
                <span className={style["note-title"]}>{note.title}</span>
              </span>
              <span className={style["update-options-right"]}>
                <button
                  className={style["update-option"]}
                  onClick={() => {
                    setNote((prev) => {
                      return { ...prev, isPinned: !note.isPinned };
                    });
                    updateNoteHandler({ ...note, isPinned: !note.isPinned });
                  }}
                >
                  {note.isPinned ? <LuPinOff /> : <LuPin />}
                </button>
                <button
                  className={style["update-option"]}
                  onClick={() => {
                    setNote((prev) => {
                      return { ...prev, archive: !note.archive };
                    });
                    updateNoteHandler({ ...note, archive: !note.archive });
                  }}
                >
                  {note.archive ? <BiArchiveOut /> : <BiArchiveIn />}
                </button>
                <button
                  className={style["update-option"]}
                  onClick={() => {
                    if (isEditing) {
                      updateNoteHandler(note);
                      setIsEditing(false);
                    } else {
                      setIsEditing(true);
                    }
                  }}
                >
                  {isEditing ? <TfiSave /> : <LuEdit />}
                </button>
                <button
                  className={style["update-option"]}
                  onClick={deleteNoteHandler}
                >
                  <MdDelete />
                </button>
              </span>
            </div>
            <div className={style["images-list"]}>
              {note.images.length > 0 &&
                note.images.map((image, _) => (
                  <NoteImageItem
                    key={_}
                    noteId={note._id}
                    imageData={image}
                    onDeleteImage={onDeleteImage}
                  />
                ))}
            </div>
            {isEditing ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  updateNoteHandler(note);
                }}
              >
                <div className={classes["form-controls"]}>
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
                  <div className={classes["form-control"]}>
                    <label htmlFor="description">Title : </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={note.title}
                      onChange={inputChangeHandler}
                      required
                    />
                  </div>
                  <div className={classes["form-control"]}>
                    <label htmlFor="description">Description : </label>
                    <textarea
                      name="description"
                      id="description"
                      value={note.description}
                      ref={textAreaRef}
                      required
                      onChange={(e) => {
                        inputChangeHandler(e);
                        handleTextareaResize();
                      }}
                    ></textarea>
                  </div>
                  <div className={classes["form-actions"]}>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className={`${classes["form-action"]} ${buttonClasses.button}`}
                    >
                      {isUpdating ? <LoadingSpinner /> : "Save"}
                    </button>
                    <button
                      type="button"
                      disabled={isUpdating}
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
            ) : (
              <div>{note.description}</div>
            )}
          </>
        )
      )}
      {error.isError && <div>{error.errorMessage}</div>}
    </div>
  );
};

export default EditNote;
