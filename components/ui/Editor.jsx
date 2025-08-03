'use client';
import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import {
  FaBold, FaItalic, FaStrikethrough, FaHeading, FaListUl, FaListOl, FaQuoteLeft, FaUndo, FaRedo
} from 'react-icons/fa';

// Array of colors for the palette
const themeColors = [
  { name: 'Text', color: 'var(--color-text)' }, 
  { name: 'Primary', color: '#3F51B5' },       
  { name: 'Secondary', color: '#F50057' },
  { name: 'Green', color: '#4CAF50' },
  { name: 'Orange', color: '#FF9800' },
];

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap text-text items-center gap-2 p-2 border border-border bg-surface rounded-t-lg">
     
      <button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={`p-2 rounded ${editor.isActive('bold') ? 'bg-primary text-white' : 'hover:bg-border'}`}><FaBold /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={`p-2 rounded ${editor.isActive('italic') ? 'bg-primary text-white' : 'hover:bg-border'}`}><FaItalic /></button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={`p-2 rounded ${editor.isActive('strike') ? 'bg-primary text-white' : 'hover:bg-border'}`}><FaStrikethrough /></button>

      <div className="h-6 w-px bg-border mx-2"></div>

      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-primary text-white' : 'hover:bg-border'}`}><FaHeading /></button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-primary text-white' : 'hover:bg-border'}`}><FaListUl /></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-primary text-white' : 'hover:bg-border'}`}><FaListOl /></button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded ${editor.isActive('blockquote') ? 'bg-primary text-white' : 'hover:bg-border'}`}><FaQuoteLeft /></button>
      
      <div className="h-6 w-px bg-border mx-2"></div>

      {themeColors.map(({ name, color }) => (
        <button
          key={name}
          onClick={() => editor.chain().focus().setColor(color).run()}
          className={`w-6 h-6 rounded-full ring-offset-2 ring-offset-surface ${editor.isActive('textStyle', { color }) ? 'ring-2 ring-primary' : 'ring-1 ring-border'}`}
          style={{ backgroundColor: color }}
          title={name}
        />
      ))}
      <button onClick={() => editor.chain().focus().unsetColor().run()} className="text-xs px-2 py-1 rounded hover:bg-border">Reset Color</button>

      <div className="h-6 w-px bg-border mx-2"></div>

      <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} className="p-2 rounded hover:bg-border disabled:opacity-50"><FaUndo /></button>
      <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} className="p-2 rounded hover:bg-border disabled:opacity-50"><FaRedo /></button>
    </div>
  );
};


export const TiptapEditor = ({ content, onUpdate, editable }) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextStyle,
      Color
    ],
    content: content || '', 
    editable: editable,
    onUpdate: ({ editor }) => {
      if (editable) {
        onUpdate(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: `prose dark:prose-invert max-w-none focus:outline-none p-4 min-h-[300px] border-x border-b border-border rounded-b-lg ${editable ? 'bg-surface' : 'bg-bg'}`,
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '', false);
    }
  }, [content, editor]);

  return (
    <div>
      {editable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
};