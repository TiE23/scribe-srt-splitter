"use client";

import { FormattedWord } from '@types';

interface WordElementProps {
  word: FormattedWord;
  index: number;
  onClick: () => void;
  onDoubleClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
}

export default function WordElement({
  word, onClick, onDoubleClick, onRightClick
}: WordElementProps) {
  const getWordClasses = () => {
    if (word.isNewCard) {
      return 'inline-block px-1 py-0.5 bg-purple-200 text-purple-800 rounded mr-1 cursor-pointer';
    } else if (word.isNewLine) {
      return 'inline-block px-1 py-0.5 bg-green-200 text-green-800 rounded mr-1 cursor-pointer';
    } else {
      return 'inline-block mr-1 hover:bg-gray-200 px-1 py-0.5 rounded cursor-pointer';
    }
  };

  return (
    <span
      className={getWordClasses()}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onRightClick}
    >
      {word.text}
    </span>
  );
}
