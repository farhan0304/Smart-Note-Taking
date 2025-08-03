'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from '@/context/AuthContext';
import { getNotesForUser, deleteNote } from '@/lib/firestore';

const DashboardContent = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getNotesForUser(user.uid)
        .then(userNotes => { setNotes(userNotes); setLoading(false); })
        .catch(error => { console.error("Error fetching notes:", error); setLoading(false); });
    }
  }, [user]);

  const handleCreateNote = () => {
    router.push('/note/new');
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(noteId);
        setNotes(notes.filter(note => note.id !== noteId));
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  if (loading) return <p className="text-center p-12">Loading notes...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl text-text font-bold font-heading">Your Notes</h1>
        <button onClick={handleCreateNote} className="flex items-center gap-2 px-5 py-2 font-semibold text-white bg-primary rounded-lg shadow-md hover:opacity-90 transition-opacity"><FaPlus /> New Note</button>
      </div>
      <div className="space-y-4">
        {notes.length > 0 ? (
          notes.map(note => (
            <div key={note.id} className="p-4 bg-surface rounded-lg shadow-md border border-border flex items-center justify-between hover:shadow-lg transition-shadow">
              <Link href={`/note/${note.id}`} className="flex-grow">
              <h2 className="text-xl font-semibold font-heading text-primary cursor-pointer pr-4 break-words">{note.title}</h2>
              </Link>
              <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                <Link href={`/note/${note.id}?edit=true`} className="text-text/70 hover:text-primary"><FaEdit size={18} /></Link>
                <button onClick={() => handleDeleteNote(note.id)} className="text-text/70 hover:text-secondary"><FaTrash size={18} /></button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-text/70 py-10 border-2 border-dashed border-border rounded-lg">
            <p>You don't have any notes yet.</p>
            <button onClick={handleCreateNote} className="mt-4 font-semibold text-primary hover:underline">Create your first note!</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function DashboardPage() {
  return (<ProtectedRoute><DashboardContent /></ProtectedRoute>);
}