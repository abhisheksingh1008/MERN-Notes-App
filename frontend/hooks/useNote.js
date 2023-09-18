"use client";

import { useContext } from "react";

import AuthContext from "@/store/auth-context";

const useNote = () => {
  const authCtx = useContext(AuthContext);

  const fetchNoteById = async (noteId) => {
    let data;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/notes/${noteId}`
      );

      data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.log(error);
    }

    return data;
  };

  const fetchNotesByUserId = async () => {
    let notesData;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/notes/user/${authCtx.user?.userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authCtx.user?.token}`,
          },
        }
      );

      notesData = await response.json();

      if (!response.ok) {
        throw new Error(notesData.message);
      }
    } catch (error) {
      console.log(error);
    }

    return notesData;
  };

  const fetchArchivedNotesByUserId = async () => {
    let archivedNotesData;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/notes/archive/user/${authCtx.user?.userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authCtx.user?.token}`,
          },
        }
      );

      archivedNotesData = await response.json();

      if (!response.ok) {
        throw new Error(archivedNotesData.message);
      }
    } catch (error) {
      console.log(error);
    }

    return archivedNotesData;
  };

  const addNewNote = async (newNoteData) => {
    const { title, description, images } = newNoteData;

    let data;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authCtx?.user?.token}`,
          },
          body: JSON.stringify({
            title,
            description,
            images,
          }),
        }
      );

      data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.log(error);
    }

    return data;
  };

  const updateNote = async (noteId, updatedNote) => {
    let data;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/notes/${noteId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authCtx.user?.token}`,
          },
          body: JSON.stringify(updatedNote),
        }
      );

      data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.log(error);
    }

    return data;
  };

  const deleteImage = async (noteId, imageData) => {
    let data;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/notes/${noteId}/delete-image`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authCtx.user?.token}`,
          },
          body: JSON.stringify({
            imageData,
          }),
        }
      );

      data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.log(error);
    }

    return data;
  };

  const deleteNote = async (deletedNoteId) => {
    let data;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/notes/${deletedNoteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authCtx.user?.token}`,
          },
        }
      );

      data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.log(error);
    }

    return data;
  };

  const showListView = async () => {
    authCtx.setGridView(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/user/${authCtx.user?.userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authCtx.user?.token}`,
          },
          body: JSON.stringify({
            updateType: "CHANGE PREFERENCES",
            prefersGridView: false,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || response.status !== 200 || !data.success) {
        throw new Error("Could not update view.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showGridView = async () => {
    authCtx.setGridView(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/user/${authCtx.user?.userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authCtx.user?.token}`,
          },
          body: JSON.stringify({
            updateType: "CHANGE PREFERENCES",
            prefersGridView: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || response.status !== 200 || !data.success) {
        throw new Error("Could not update view.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    fetchNoteById,
    fetchNotesByUserId,
    fetchArchivedNotesByUserId,
    addNewNote,
    updateNote,
    deleteImage,
    deleteNote,
    showListView,
    showGridView,
  };
};

export default useNote;
