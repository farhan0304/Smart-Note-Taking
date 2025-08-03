'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FaArrowLeft, FaEdit, FaTrash, FaSave, FaCheck, FaTimes } from 'react-icons/fa';
import { FaWandMagicSparkles } from "react-icons/fa6";
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { TiptapEditor } from '@/components/ui/Editor';
import { getNoteById, updateNote, deleteNote } from '@/lib/firestore';

const NotePageContent = () => {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { noteId } = params;

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(searchParams.get('edit') === 'true');
  const [editableTitle, setEditableTitle] = useState('');
  const [editableContent, setEditableContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [isGenerating, setIsGenerating] = useState(null); 
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [suggestionType, setSuggestionType] = useState(null);

  const editorRef = { current: null };

  useEffect(() => {
    const fetchNote = async () => {
      if (!user || !noteId) return;
      try {
        const fetchedNote = await getNoteById(noteId);
        if (fetchedNote && fetchedNote.authorId === user.uid) {
          setNote(fetchedNote);
          setEditableTitle(fetchedNote.title);
          setEditableContent(fetchedNote.content);
        } else { router.push('/dashboard'); }
      } catch (error) {
        console.error("Error fetching note:", error);
        router.push('/dashboard');
      } finally { setLoading(false); }
    };
    fetchNote();
  }, [noteId, user, router]);

  const handleSaveNote = async () => {
    if(!editableTitle) return alert("You must provide a title for the note");
    if(!editableContent || editableContent.match(/^<p><\/p>$/)) return alert("Please write the content for the note");
    setIsSaving(true);
    try {
      await updateNote(noteId, editableTitle, editableContent);
      setNote({ ...note, title: editableTitle, content: editableContent });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save the note.");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to permanently delete this note?")) {
      try {
        await deleteNote(noteId);
        router.push('/dashboard');
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  const handleAIGeneration = async (task, content) => {
    setIsGenerating(task === 'generate_title' ? 'title' : 'content');
    setAiSuggestion(null); // Clear previous suggestions
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, content }),
      });

      if (!response.ok) throw new Error('Failed to get AI suggestion.');

      const data = await response.json();
      setAiSuggestion(data.suggestion);
      setSuggestionType(task === 'generate_title' ? 'title' : 'content');
    } catch (error) {
      console.error(error);
      alert("There was an error generating the AI suggestion.");
    } finally {
      setIsGenerating(null);
    }
  };

  const handleAcceptSuggestion = () => {
    if (!aiSuggestion) return;
    if (suggestionType === 'title') {
      setEditableTitle(aiSuggestion);
    } else if (suggestionType === 'content') {
      setEditableContent(aiSuggestion);
    }
    
    setAiSuggestion(null);
    setSuggestionType(null);
  };
 
  const handleDeclineSuggestion = () => {
    setAiSuggestion(null);
    setSuggestionType(null);
  };

  if (loading) return <p className="text-center p-12">Loading note...</p>;
  if (!note) return <p className="text-center p-12">Note not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-text/80 hover:text-primary"><FaArrowLeft /> Back to Dashboard</button>
        {!isEditing && (
          <div className="flex items-center gap-4">
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-text/80 hover:text-primary"><FaEdit /> Edit</button>
            <button onClick={handleDelete} className="flex items-center gap-2 text-text/80 hover:text-secondary"><FaTrash /> Delete</button>
          </div>
        )}
      </div>

      {isEditing ? (
        <input type="text" value={editableTitle} onChange={(e) => setEditableTitle(e.target.value)} className="w-full text-4xl font-bold font-heading text-text bg-transparent focus:outline-none mb-6" placeholder="Note Title"/>
      ) : (
        <h1 className="text-4xl text-text font-bold font-heading mb-6">{note.title}</h1>
      )}

        {isEditing && aiSuggestion && suggestionType === 'title' && (
        <div className="p-4 mb-4 bg-primary/10 border-l-4 border-primary rounded-r-lg animate-fade-in">
          <p className="font-semibold text-primary mb-2">Suggested Title:</p>
          <p className="italic text-text">"{aiSuggestion}"</p>
          <div className="flex gap-2 mt-3">
            <button onClick={handleAcceptSuggestion} className="px-3 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700 flex items-center gap-1"><FaCheck/> Accept</button>
            <button onClick={handleDeclineSuggestion} className="px-3 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700 flex items-center gap-1"><FaTimes/> Decline</button>
          </div>
        </div>
      )}

      {isEditing ? (
        <TiptapEditor content={editableContent} onUpdate={setEditableContent} editable={true}/>
      ) : (
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: note.content }} />
      )}

      {isEditing && aiSuggestion && suggestionType === 'content' && (
        <div className="p-4 mt-4 bg-primary/10 border-l-4 border-primary rounded-r-lg animate-fade-in">
          <p className="font-semibold text-primary mb-2">Suggested Refinements:</p>
          <div className="prose dark:prose-invert max-w-none text-sm border border-border rounded p-2 bg-surface" dangerouslySetInnerHTML={{ __html: aiSuggestion }} />
          <div className="flex gap-2 mt-3">
            <button onClick={handleAcceptSuggestion} className="px-3 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700 flex items-center gap-1"><FaCheck/> Accept</button>
            <button onClick={handleDeclineSuggestion} className="px-3 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700 flex items-center gap-1"><FaTimes/> Decline</button>
          </div>
        </div>
      )}
      
      
      {isEditing && (
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button onClick={handleSaveNote} disabled={isSaving || isGenerating} className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 font-semibold text-white bg-primary rounded-lg shadow-md hover:opacity-90 disabled:opacity-50">
            <FaSave /> {isSaving ? 'Saving...' : 'Save Note'}
          </button>
          
          <button onClick={() => handleAIGeneration('refine_content', editableContent)} disabled={!!isGenerating} className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 font-semibold text-primary bg-primary/20 rounded-lg hover:bg-primary/30 disabled:opacity-50">
            <FaWandMagicSparkles className={isGenerating === 'content' ? 'animate-pulse' : ''} /> {isGenerating === 'content' ? 'Refining...' : 'Refine Note'}
          </button>
          
           <button onClick={() => handleAIGeneration('generate_title', editableContent)} disabled={!!isGenerating} className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 font-semibold text-primary bg-primary/20 rounded-lg hover:bg-primary/30 disabled:opacity-50">
            <FaWandMagicSparkles className={isGenerating === 'title' ? 'animate-pulse' : ''} /> {isGenerating === 'title' ? 'Generating...' : 'Generate Title'}
          </button>
        </div>
      )}
    </div>
  );
};

export default function NotePage() {
    return (<ProtectedRoute><NotePageContent /></ProtectedRoute>);
}