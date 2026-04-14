"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, Heading1, Heading2, Quote } from "lucide-react";

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
}

const Editor = ({ content, onChange }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing your scientific solo deep-dive here...",
      }),
    ],
    content: content,
    immediatelyRender: false, // <--- ADD THIS LINE TO FIX THE ERROR
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[500px] p-8",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-gray-100 rounded-[2rem] overflow-hidden bg-white shadow-sm">
      {/* TOOLBAR */}
      <div className="bg-gray-50/50 border-b border-gray-100 p-4 flex flex-wrap gap-2">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 rounded-lg transition ${editor.isActive("heading", { level: 1 }) ? "bg-brand-deep text-white" : "hover:bg-white text-brand-muted"}`}
        >
          <Heading1 size={20} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded-lg transition ${editor.isActive("heading", { level: 2 }) ? "bg-brand-deep text-white" : "hover:bg-white text-brand-muted"}`}
        >
          <Heading2 size={20} />
        </button>
        <div className="w-[1px] h-8 bg-gray-200 mx-2" />
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg transition ${editor.isActive("bold") ? "bg-brand-deep text-white" : "hover:bg-white text-brand-muted"}`}
        >
          <Bold size={20} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg transition ${editor.isActive("italic") ? "bg-brand-deep text-white" : "hover:bg-white text-brand-muted"}`}
        >
          <Italic size={20} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg transition ${editor.isActive("bulletList") ? "bg-brand-deep text-white" : "hover:bg-white text-brand-muted"}`}
        >
          <List size={20} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg transition ${editor.isActive("blockquote") ? "bg-brand-deep text-white" : "hover:bg-white text-brand-muted"}`}
        >
          <Quote size={20} />
        </button>
      </div>

      {/* EDITABLE AREA */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
