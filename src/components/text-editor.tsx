"use client";
import { uploadImage } from "@/services/article-service";
import { useEditor, EditorContent, useEditorState, Editor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Placeholder, CharacterCount } from "@tiptap/extensions";

import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ImageIcon,
  Italic,
  Redo2,
  Undo2,
} from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const MenuBar = ({ editor }: { editor: Editor }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { isBold, isItalic, canUndo, canRedo, align } = useEditorState({
    editor,
    selector: ({ editor }) => {
      const is = editor.isActive.bind(editor);

      return {
        isBold: is("bold"),
        isItalic: is("italic"),
        canUndo: editor.can().chain().undo().run(),
        canRedo: editor.can().chain().redo().run(),
        align: is({ textAlign: "left" })
          ? "left"
          : is({ textAlign: "center" })
          ? "center"
          : is({ textAlign: "right" })
          ? "right"
          : is({ textAlign: "justify" })
          ? "justify"
          : null,
      };
    },
  });

  const handleUploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadImage(file);
      editor?.commands.setImage({
        src: result.imageUrl,
        width: 250,
        height: 250,
        alt: "image-content",
        title: "image-content",
      });
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const alignClass = (pos: string) => (align === pos ? "text-blue-500" : "text-slate-600");

  return (
    <div className="p-4 bg-white border-b border-b-slate-200 flex items-center gap-x-4">
      {/* Undo / Redo */}
      <div className="space-x-1 flex items-center">
        <button
          type="button"
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!canUndo}
          className={`transition-colors ${canUndo ? "text-slate-600" : "text-slate-300"}`}
        >
          <Undo2 className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!canRedo}
          className={`transition-colors ${canRedo ? "text-slate-600" : "text-slate-300"}`}
        >
          <Redo2 className="size-4" />
        </button>
      </div>

      {/* Bold / Italic */}
      <div className="space-x-1 flex items-center">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={isBold ? "text-blue-500" : "text-slate-600"}
        >
          <Bold className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={isItalic ? "text-blue-500" : "text-slate-600"}
        >
          <Italic className="size-4" />
        </button>
      </div>

      {/* Image Upload */}
      <div className="flex items-center text-slate-600">
        <button type="button" onClick={() => inputRef.current?.click()}>
          <ImageIcon className="size-4" />
        </button>
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleUploadImage} />
      </div>

      {/* Alignment */}
      <div className="space-x-1 flex items-center">
        <button type="button" onClick={() => editor?.chain().focus().setTextAlign("left").run()}>
          <AlignLeft className={`size-4 ${alignClass("left")}`} />
        </button>
        <button type="button" onClick={() => editor?.chain().focus().setTextAlign("center").run()}>
          <AlignCenter className={`size-4 ${alignClass("center")}`} />
        </button>
        <button type="button" onClick={() => editor?.chain().focus().setTextAlign("right").run()}>
          <AlignRight className={`size-4 ${alignClass("right")}`} />
        </button>
        <button type="button" onClick={() => editor?.chain().focus().setTextAlign("justify").run()}>
          <AlignJustify className={`size-4 ${alignClass("justify")}`} />
        </button>
      </div>
    </div>
  );
};

const TextEditor = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
  const [wordCount, setWordCount] = useState(0);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Type a content...",
      }),
      CharacterCount,
    ],
    content: value,
    immediatelyRender: false,

    onUpdate({ editor }) {
      const characterStorage = editor.storage.characterCount;
      setWordCount(characterStorage.words());
      onChange(editor.getHTML());
    },
  });
  useEffect(() => {
    if (editor && value) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor) {
    return;
  }
  return (
    <div className="bg-gray-50 border border-slate-200 rounded-[12px] shadow-sm overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="p-4 " />
      <div className="bg-white px-6 py-4 gap-x-2 text-xs text-gray-900">
        <span>{wordCount}</span> <span>Words</span>
      </div>
    </div>
  );
};

export default TextEditor;
