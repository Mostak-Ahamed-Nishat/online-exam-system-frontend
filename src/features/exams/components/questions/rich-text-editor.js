"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import {
  Bold,
  ChevronDown,
  Code,
  FileCode2,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo2,
  RotateCcw,
  Strikethrough,
  Unlink,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Type here...",
  compact = false,
  className,
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "min-h-[120px] w-full px-4 py-3 text-[16px] text-[var(--text-primary)] focus:outline-none",
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChange?.(instance.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if ((value || "") !== current) {
      editor.commands.setContent(value || "", false);
    }
  }, [editor, value]);

  if (!editor) return <div className="min-h-[120px] w-full rounded-[10px] border border-[var(--border-disabled)] bg-[var(--background-white)]" />;

  const activeTextStyle = editor.isActive("heading", { level: 2 })
    ? "heading-2"
    : editor.isActive("heading", { level: 3 })
      ? "heading-3"
      : "paragraph";

  const onTextStyleChange = (nextValue) => {
    if (nextValue === "heading-2") {
      editor.chain().focus().setHeading({ level: 2 }).run();
      return;
    }
    if (nextValue === "heading-3") {
      editor.chain().focus().setHeading({ level: 3 }).run();
      return;
    }
    editor.chain().focus().setParagraph().run();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  return (
    <div className={cn("rounded-[10px] border border-[var(--border-disabled)] bg-[var(--background-white)]", className)}>
      <div className="flex min-h-10 flex-wrap items-center gap-2 border-b border-[var(--border-disabled)] bg-[var(--background-color)] px-3 py-1 text-[var(--icon-black)] sm:px-4">
        <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarDivider />

        <div className="relative">
          <select
            value={activeTextStyle}
            onChange={(event) => onTextStyleChange(event.target.value)}
            className="h-7 cursor-pointer appearance-none rounded-[6px] border border-transparent bg-[var(--background-color)] pl-2 pr-7 text-[14px] text-[var(--text-primary)] transition-colors hover:border-[var(--border-disabled)]"
          >
            <option value="paragraph">Normal text</option>
            <option value="heading-2">Heading 2</option>
            <option value="heading-3">Heading 3</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--icon-gray)]" />
        </div>
        <ToolbarDivider />

        <ToolbarButton
          label="Paragraph"
          active={editor.isActive("paragraph")}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <Pilcrow className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarDivider />

        <ToolbarButton
          label="Bulleted list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Blockquote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Code block"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <FileCode2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarDivider />

        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Strike"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Inline code"
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarDivider />

        <ToolbarButton
          label="Set link"
          active={editor.isActive("link")}
          onClick={setLink}
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Unset link"
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <Unlink className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Clear formatting"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        >
          <RotateCcw className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <EditorContent
        editor={editor}
        className={cn(
          "tiptap-editor [&_.ProseMirror]:min-h-[120px] [&_.ProseMirror]:outline-none [&_.ProseMirror_h2]:text-[24px] [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:leading-[32px] [&_.ProseMirror_h3]:text-[20px] [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:leading-[28px]",
          compact ? "[&_.ProseMirror]:min-h-[92px]" : "",
        )}
      />
    </div>
  );
}

function ToolbarDivider() {
  return <span className="h-5 w-px bg-[var(--border-disabled)]" aria-hidden="true" />;
}

function ToolbarButton({ label, active = false, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-[6px] text-[var(--icon-black)] transition-colors hover:bg-[var(--background-white)]",
        active ? "bg-[var(--button-lightblue)] text-[var(--button-primary)]" : "",
      )}
    >
      {children}
    </button>
  );
}
