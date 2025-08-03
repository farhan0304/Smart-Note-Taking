import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy
} from "firebase/firestore";
import { db } from "./firebase";

// Get all notes for a specific user, ordered by creation date
export const getNotesForUser = async (userId) => {
  const notesCol = collection(db, "notes");
  const q = query(notesCol, where("authorId", "==", userId), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const notes = [];
  querySnapshot.forEach((doc) => {
    notes.push({ id: doc.id, ...doc.data() });
  });
  return notes;
};

// Get a single note by its ID
export const getNoteById = async (noteId) => {
  const noteRef = doc(db, "notes", noteId);
  const docSnap = await getDoc(noteRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

// Add a new note with user-provided title and content
export const addNote = (userId, title, content) => {
  const finalTitle = title.trim() ? title.trim() : "Untitled Note";
  return addDoc(collection(db, "notes"), {
    authorId: userId,
    title: finalTitle,
    content: content,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

// Update an existing note
export const updateNote = (noteId, title, content) => {
  const finalTitle = title.trim() ? title.trim() : "Untitled Note";
  const noteRef = doc(db, "notes", noteId);
  return updateDoc(noteRef, {
    title: finalTitle,
    content: content,
    updatedAt: serverTimestamp(),
  });
};

// Delete a note
export const deleteNote = (noteId) => {
  const noteRef = doc(db, "notes", noteId);
  return deleteDoc(noteRef);
};