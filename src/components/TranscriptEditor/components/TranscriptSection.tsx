"use client";

import WordElement from "@components/WordElement";
import { useSettings } from "@contexts/AppContext";
import { ProjectTranscript } from "@types";
import { useCallback } from "react";

export function TranscriptSection() {
  const { projectTranscript, setProjectTranscript } = useSettings();

  const handleWordClick = useCallback(
    (index: number) => {
      setProjectTranscript((prev) => {
        if (!prev) return null;

        const newWords = [...prev.words];
        const currentWord = newWords[index];

        // Determine the next state based on current flags
        let newLineAfter = false;
        let newCardAfter = false;

        if (!currentWord.newLineAfter && !currentWord.newCardAfter) {
          // Current: none → Next: newLine
          newLineAfter = true;
        } else if (currentWord.newLineAfter && !currentWord.newCardAfter) {
          // Current: newLine → Next: newCard
          newCardAfter = true;
        }
        // Current: newCard → Next: none (both remain false)

        newWords[index] = {
          ...currentWord,
          newLineAfter,
          newCardAfter,
        };

        return { ...prev, words: newWords };
      });
    },
    [setProjectTranscript],
  );

  const handleWordEdit = useCallback(
    (index: number, newText: string) => {
      setProjectTranscript((prev) => {
        if (!prev) return null;

        const newWords = [...prev.words];
        const currentWord = newWords[index];

        newWords[index] = {
          ...currentWord,
          revisedText: newText === currentWord.text ? "" : newText,
        };

        return { ...prev, words: newWords };
      });
    },
    [setProjectTranscript],
  );

  return (
    <div className="col-span-5 h-full rounded-lg bg-white p-4 shadow-md">
      <h2 className="mb-4 text-xl font-bold select-none">Transcript</h2>
      <div className="h-[90cqh] overflow-y-scroll py-2 leading-relaxed">
        {projectTranscript?.words
          .map((word, originalIndex) => {
            if (word.type === "word") {
              return (
                <WordElement
                  key={originalIndex}
                  word={word}
                  index={originalIndex}
                  onClick={() => handleWordClick(originalIndex)}
                  onEdit={(text) => handleWordEdit(originalIndex, text)}
                />
              );
            }
            return null;
          })
          .filter(Boolean)}
      </div>
    </div>
  );
}
