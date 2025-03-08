"use client";

import { FormattedWord } from "@/types";
import { getWordClasses } from "@utils/styles";
import clsx from "clsx";

interface WordElementProps {
  word: FormattedWord;
  index: number;
  onClick: () => void;
  onDoubleClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
}

export default function WordElement({
  word,
  onClick,
  onDoubleClick,
  onRightClick,
}: WordElementProps) {
  return (
    <span
      className={clsx("select-none", getWordClasses(word.newCardAfter, word.newLineAfter))}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onRightClick}
    >
      {word.text}
      {word.newCardAfter && <span className="ml-1 text-purple-800">⏎⏎</span>}
      {word.newLineAfter && <span className="ml-1 text-green-800">⏎</span>}
    </span>
  );
}
