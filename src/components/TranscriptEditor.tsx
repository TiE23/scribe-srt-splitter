"use client";

import { useCallback, useMemo, useState } from "react";
import { FormattedTranscript } from "@types";
import WordElement from "./WordElement";
import { getWordClasses } from "@utils/styles";
import { generateSrt } from "@utils/export";
import { useSettings } from "@contexts/SettingsContext";
import SettingsButton from "./SettingsButton";
import SettingsModal from "./SettingsModal";
import clsx from "clsx";

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

  // New handler for word editing
  const handleWordEdit = useCallback(
    (index: number, newText: string) => {
      setTranscript((prev) => {
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
    [setTranscript],
  );

  // Enhanced preview section in TranscriptEditor.tsx
  const { subtitles } = useMemo(() => generateSrt(transcript, settings), [transcript, settings]);

  return (
    <div className="flex w-full flex-col gap-y-4 px-4 pt-4">
      <div className="flex flex-row items-center justify-between rounded-lg bg-white p-6 shadow-md">
        <div className="flex flex-col gap-y-4">
          <h2 className="text-xl font-bold">ElevenLabs Scribe JSON to Custom Timed SRT Tool</h2>
          <div className="flex flex-col gap-y-2 text-sm text-gray-600">
            <p>
              <strong>Click</strong> a word to cycle through formatting options:
            </p>
            <p className="ml-4">
              No formatting → <span className={getWordClasses(false, true)}>New line</span> →{" "}
              <span className={getWordClasses(true, false)}>New subtitle card</span> → No formatting
            </p>
            <p>
              <strong>Right-click</strong> on any word to edit its text.
            </p>
            <p className="ml-4">
              Press <kbd>Enter</kbd> to save or <kbd>Esc</kbd> to cancel. Save blank to reset. Enter
              &quot;<span className="font-mono">_</span>&quot; to force a blank.
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

      <div className="@container mb-4 grid grid-cols-8 gap-2">
        {/* Transcript Section */}
        <div className="col-span-5 h-full rounded-lg bg-white p-4 shadow-md">
          <h2 className="mb-4 text-xl font-bold select-none">Transcript</h2>
          <div className="h-[90cqh] overflow-y-scroll py-2 leading-relaxed">
            {transcript.words
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
        {/* Preview Section */}
        <div className="col-span-3 h-full rounded-lg bg-white p-4 shadow-md">
          <h2 className="mb-4 text-xl font-bold select-none">Preview</h2>
          <div className="flex h-[90cqh] flex-grow flex-col overflow-x-hidden overflow-y-scroll">
            {subtitles.map((subtitle, index) => (
              <div key={index} className="subtitle-card relative overflow-clip">
                <div className="subtitle-index">Subtitle {index + 1}</div>
                <div className="subtitle-time">
                  {subtitle.startTime} → {subtitle.endTime}
                </div>
                <div className="subtitle-text relative w-fit">
                  {settings.rule && (
                    <div
                      className="absolute h-full w-px bg-purple-600/30"
                      style={{ left: `${settings.rule * 5}px` }}
                    />
                  )}
                  <div className={clsx(settings.centerText && "text-center")}>{subtitle.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
