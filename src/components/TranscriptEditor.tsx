"use client";

import { useCallback, useMemo, useState } from "react";
import { FormattedTranscript } from "@types";
import WordElement from "./WordElement";
import { getWordClasses } from "@utils/styles";
import { generateSrt } from "@utils/export";
import { useSettings } from "@contexts/SettingsContext";
import SettingsButton from "./SettingsButton";
import SettingsModal from "./SettingsModal";

interface TranscriptEditorProps {
  transcript: FormattedTranscript;
  setTranscript: React.Dispatch<React.SetStateAction<FormattedTranscript | null>>;
}

export default function TranscriptEditor({
  transcript,
  setTranscript,
  children,
}: React.PropsWithChildren<TranscriptEditorProps>) {
  const { settings } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Handle word click - rotate through states: none → newLine → newCard → none
  const handleWordClick = useCallback(
    (index: number) => {
      setTranscript((prev) => {
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
    [setTranscript],
  );

  // Enhanced preview section in TranscriptEditor.tsx
  const { subtitles } = useMemo(() => generateSrt(transcript, settings), [transcript, settings]);

  return (
    <div className="mb-8 flex w-full flex-col gap-y-4">
      <div className="relative flex flex-row items-center justify-between rounded-lg bg-white p-6 shadow-md">
        <div>
          <h2 className="mb-4 text-xl font-bold">11Labs Scribe JSON to Custom Timed SRT Tool</h2>
          <div className="mb-4 text-sm text-gray-600">
            <p>Click a word to cycle through formatting options:</p>
            <p className="ml-4">
              • No formatting → <span className={getWordClasses(false, true)}>New line</span> →{" "}
              <span className={getWordClasses(true, false)}>New subtitle card</span> → No formatting
            </p>
          </div>
        </div>

        <div className="flex items-center">
          {children}
          <SettingsButton onClick={() => setIsSettingsOpen(true)} />
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && <SettingsModal onClickClose={() => setIsSettingsOpen(false)} />}

      <div className="@container grid h-[calc(100vh-80px)] grid-cols-8 gap-2">
        {/* Transcript Section */}
        <div className="col-span-5 rounded-lg bg-white p-4 shadow-md @md:h-[98cqh] @lg:h-[98cqh]">
          <h2 className="mb-4 text-xl font-bold">Transcript</h2>
          <div className="h-[90cqh] overflow-y-scroll px-4 py-2 leading-relaxed">
            {transcript.words
              .map((word, originalIndex) => {
                if (word.type === "word") {
                  return (
                    <WordElement
                      key={originalIndex}
                      word={word}
                      index={originalIndex}
                      onClick={() => handleWordClick(originalIndex)}
                    />
                  );
                }
                return null;
              })
              .filter(Boolean)}
          </div>
        </div>
        {/* Preview Section */}
        <div className="col-span-3 flex flex-col rounded-lg bg-white p-4 shadow-md @md:h-[98cqh] @lg:h-[98cqh]">
          <h2 className="mb-4 text-xl font-bold">Preview</h2>
          <div className="flex flex-grow flex-col overflow-x-hidden overflow-y-auto">
            {subtitles.map((subtitle, index) => (
              <div key={index} className="subtitle-card">
                <div className="subtitle-index">Subtitle {index + 1}</div>
                <div className="subtitle-time">
                  {subtitle.startTime} → {subtitle.endTime}
                </div>
                <div className="subtitle-text">{subtitle.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
