"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bold, ChevronDown, Italic, List, Redo2, Underline, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

function normalizeHtml(value) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed === "<p></p>" || trimmed === "<div><br></div>" || trimmed === "<br>") {
    return "";
  }

  return trimmed;
}

export function AttemptRichTextEditor({
  value,
  onChange,
  placeholder = "Type questions here..",
}) {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const normalized = useMemo(() => normalizeHtml(value), [value]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const nextHtml = normalized || "";
    if (editor.innerHTML !== nextHtml) {
      editor.innerHTML = nextHtml;
    }

    const text = editor.textContent?.trim() || "";
    setIsEmpty(text.length === 0);
  }, [normalized]);

  const runCommand = (command, commandValue) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    document.execCommand(command, false, commandValue);
    const nextValue = editor.innerHTML;
    const text = editor.textContent?.trim() || "";
    setIsEmpty(text.length === 0);
    onChange?.(nextValue);
  };

  const handleInput = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const text = editor.textContent?.trim() || "";
    setIsEmpty(text.length === 0);
    onChange?.(editor.innerHTML);
  };

  return (
    <div className="rounded-[10px] border border-[var(--border-inputfield)] bg-[var(--background-white)]">
      <div className="flex min-h-13 flex-wrap items-center gap-2 border-b border-[var(--border-disabled)] bg-[#f3f4f6] px-4 py-2">
        <ToolbarButton label="Undo" onClick={() => runCommand("undo")}>
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Redo" onClick={() => runCommand("redo")}>
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>

        <div className="relative ml-1">
          <select
            className="h-8 appearance-none rounded-md border border-transparent bg-transparent pl-2 pr-6 text-sm text-[var(--text-primary)] transition-colors hover:border-[var(--border-disabled)]"
            defaultValue="p"
            onChange={(event) => runCommand("formatBlock", event.target.value)}
          >
            <option value="p">Normal text</option>
            <option value="h3">Heading 3</option>
            <option value="h2">Heading 2</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--icon-gray)]" />
        </div>

        <ToolbarButton label="Bullet List" onClick={() => runCommand("insertUnorderedList")}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Bold" onClick={() => runCommand("bold")}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Italic" onClick={() => runCommand("italic")}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Underline" onClick={() => runCommand("underline")}>
          <Underline className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div className="relative">
        {isEmpty ? (
          <span className="pointer-events-none absolute left-4 top-4 text-base font-normal text-[var(--test-disable)]">
            {placeholder}
          </span>
        ) : null}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "min-h-60 w-full px-4 py-4 text-base font-medium leading-6 text-[var(--text-primary)] outline-none",
            isFocused ? "ring-1 ring-[var(--border-primary)]" : "",
          )}
        />
      </div>
    </div>
  );
}

function ToolbarButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[var(--icon-black)] transition-colors hover:bg-[var(--background-white)]"
    >
      {children}
    </button>
  );
}
