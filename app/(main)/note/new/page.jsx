'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaSave,FaCheck, FaTimes } from 'react-icons/fa';
import { FaWandMagicSparkles } from "react-icons/fa6";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from '@/context/AuthContext';
import { TiptapEditor } from '@/components/ui/Editor';
import { addNote } from '@/lib/firestore';

const NewNotePageContent = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [isGenerating, setIsGenerating] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState(null); 
  const [suggestionType, setSuggestionType] = useState(null);
  
  const handleSaveNote = async () => {
    if (!user) return alert("You must be logged in to save a note.");
    if(!title) return alert("You must provide a title for the note");
    if(!content) return alert("Please write the content for the note");
    setIsSaving(true);
    try {
      const newNoteRef = await addNote(user.uid, title, content);
      router.push(`/note/${newNoteRef.id}`);
    } catch (error) {
      console.error("Error saving new note:", error);
      alert("Failed to save the note. Please try again.");
      setIsSaving(false);
    }
  };

    const handleAIGeneration = async (task, contentForAI) => {
    setIsGenerating(task === 'generate_title' ? 'title' : 'content');
    setAiSuggestion(null);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, content: contentForAI }),
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
      setTitle(aiSuggestion);
    } else if (suggestionType === 'content') {
      setContent(aiSuggestion);
    }
    setAiSuggestion(null);
    setSuggestionType(null);
  };
  
  const handleDeclineSuggestion = () => {
    setAiSuggestion(null);
    setSuggestionType(null);
  };


  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6"><button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-text/80 hover:text-primary"><FaArrowLeft /> Back to Dashboard</button></div>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full text-4xl font-bold font-heading bg-transparent focus:outline-none mb-6 border-b-2 border-border focus:border-primary transition-colors text-text" placeholder="Untitled Note" />

      {aiSuggestion && suggestionType === 'title' && (
        <div className="p-4 mb-4 bg-primary/10 border-l-4 border-primary rounded-r-lg animate-fade-in">
          <p className="font-semibold text-primary mb-2">Suggested Title:</p>
          <p className="italic text-text">"{aiSuggestion}"</p>
          <div className="flex gap-2 mt-3">
            <button onClick={handleAcceptSuggestion} className="px-3 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700 flex items-center gap-1"><FaCheck/> Accept</button>
            <button onClick={handleDeclineSuggestion} className="px-3 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700 flex items-center gap-1"><FaTimes/> Decline</button>
          </div>
        </div>
      )}

      <TiptapEditor content={content} onUpdate={setContent} editable={true} />

      {aiSuggestion && suggestionType === 'content' && (
        <div className="p-4 mt-4 bg-primary/10 border-l-4 border-primary rounded-r-lg animate-fade-in">
          <p className="font-semibold text-primary mb-2">Suggested Refinements:</p>
          <div className="prose dark:prose-invert max-w-none text-sm border border-border rounded p-2 bg-surface" dangerouslySetInnerHTML={{ __html: aiSuggestion }} />
          <div className="flex gap-2 mt-3">
            <button onClick={handleAcceptSuggestion} className="px-3 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700 flex items-center gap-1"><FaCheck/> Accept</button>
            <button onClick={handleDeclineSuggestion} className="px-3 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700 flex items-center gap-1"><FaTimes/> Decline</button>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button 
          onClick={handleSaveNote} 
          disabled={isSaving || !!isGenerating}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 font-semibold text-white bg-primary rounded-lg shadow-md hover:opacity-90 disabled:opacity-50"
        >
          <FaSave /> {isSaving ? 'Saving...' : 'Save Note'}
        </button>
        
        <button 
          onClick={() => handleAIGeneration('refine_content', content)} 
          disabled={!!isGenerating} 
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 font-semibold text-primary bg-primary/20 rounded-lg hover:bg-primary/30 disabled:opacity-50"
        >
          <FaWandMagicSparkles className={isGenerating === 'content' ? 'animate-pulse' : ''} /> {isGenerating === 'content' ? 'Refining...' : 'Refine Note'}
        </button>
        
        <button 
          onClick={() => handleAIGeneration('generate_title', content)} 
          disabled={!!isGenerating} 
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 font-semibold text-primary bg-primary/20 rounded-lg hover:bg-primary/30 disabled:opacity-50"
        >
          <FaWandMagicSparkles className={isGenerating === 'title' ? 'animate-pulse' : ''} /> {isGenerating === 'title' ? 'Generating...' : 'Generate Title'}
        </button>
      </div>
    </div>
  );
};

export default function NewNotePage() {
    return (<ProtectedRoute><NewNotePageContent /></ProtectedRoute>);
}