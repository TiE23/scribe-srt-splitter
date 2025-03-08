"use client";

import { FormattedWord } from "@types";
import { getWordClasses } from "@utils/styles";
import clsx from "clsx";

interface WordElementProps {
  word: FormattedWord;
  index: number;
  onClick: () => void;
}

export default function WordElement({ word, onClick }: WordElementProps) {
  return (
    <span
      className={clsx("select-none", getWordClasses(word.newCardAfter, word.newLineAfter))}
      onClick={onClick}
    >
      {word.text}
      {word.newCardAfter && <span className="ml-1 text-purple-800">⏎⏎</span>}
      {word.newLineAfter && <span className="ml-1 text-green-800">⏎</span>}
    </span>
  );
}
