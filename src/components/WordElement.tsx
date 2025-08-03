"use client";

import { ProjectWord } from "@types";
import { getWordClasses } from "@utils/styles";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";

interface WordElementProps {
  word: ProjectWord;
  index: number;
  onClick: () => void;
  onEdit: (text: string) => void;
}

export default function WordElement({ word, onClick, onEdit }: WordElementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(word.revisedText || word.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editText.trim() !== (word.revisedText || word.text)) {
      onEdit(editText.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onEdit(editText.trim());
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditText(word.revisedText || word.text);
    }
  };

  return (
    <>
      {isEditing ? (
        <input
          ref={inputRef}
          className="inline-block w-[10ch] rounded-xs border border-blue-500 px-1 py-0 text-blue-700 outline-none"
          value={editText}
          placeholder={word.text}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          data-form-type="other"
          data-lpignore="true"
          data-1password-ignore="true"
        />
      ) : (
        <span
          className={clsx(
            "select-none",
            getWordClasses(word.newCardAfter, word.newLineAfter),
            word.revisedText && "font-bold text-blue-700",
          )}
          onClick={onClick}
          onContextMenu={handleRightClick}
        >
          {word.revisedText || word.text}
          {word.newCardAfter && <span className="ml-1 text-purple-800">⏎⏎</span>}
          {word.newLineAfter && <span className="ml-1 text-green-800">⏎</span>}
        </span>
      )}
    </>
  );
}
