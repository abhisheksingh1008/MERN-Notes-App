"use client";

import { useState } from "react";

import useNote from "@/hooks/useNote";
import { MdDelete } from "react-icons/md";
import style from "@/styles/UpdateNote.module.css";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";

const NoteImageItem = ({ imageData, noteId, onDeleteImage }) => {
  const noteHook = useNote();
  const [isDeletingImage, setIsDeletingImage] = useState(false);

  const deleteImageHandler = async () => {
    setIsDeletingImage(true);
    const response = await noteHook.deleteImage(noteId, imageData);
    setIsDeletingImage(false);

    if (response.success) {
      onDeleteImage(response.note);
      toast.success(response.message);
    } else {
      toast.error("Something went wrong, failed to delete image");
    }
  };

  return (
    <div className={style["image-item-container"]}>
      <a target={"_blank"} href={imageData?.image_url}>
        <div className={style["image-container"]}>
          <img src={imageData?.image_url} className={style.image} />
        </div>
      </a>
      <button
        disabled={isDeletingImage}
        onClick={deleteImageHandler}
        className={style["image-delete-button"]}
      >
        {isDeletingImage ? <LoadingSpinner /> : <MdDelete />}
      </button>
    </div>
  );
};

export default NoteImageItem;
