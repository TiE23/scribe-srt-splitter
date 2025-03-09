"use client";

import { useCallback, useMemo } from "react";
import { FormattedTranscript } from "@/types";
import WordElement from "./WordElement";
import { getWordClasses } from "@utils/styles";
import { generateSrt } from "@utils/export";

interface TranscriptEditorProps {
  transcript: FormattedTranscript;
  setTranscript: React.Dispatch<React.SetStateAction<FormattedTranscript | null>>;
}

export default function TranscriptEditor({
  transcript,
  setTranscript,
  children,
}: React.PropsWithChildren<TranscriptEditorProps>) {
  // Handle single click - add newline after this word
  const handleWordClick = useCallback(
    (index: number) => {
      setTranscript((prev) => {
        if (!prev) return null;

        const newWords = [...prev.words];
        newWords[index] = {
          ...newWords[index],
          newLineAfter: !newWords[index].newLineAfter,
          // If we're adding a newline, remove any newCard that might be there
          newCardAfter: newWords[index].newLineAfter ? newWords[index].newCardAfter : false,
        };

        return { ...prev, words: newWords };
      });
    },
    [setTranscript],
  );

  // Handle double click - add new subtitle card after this word
  const handleWordDoubleClick = useCallback(
    (index: number) => {
      setTranscript((prev) => {
        if (!prev) return null;

        const newWords = [...prev.words];
        newWords[index] = {
          ...newWords[index],
          newCardAfter: !newWords[index].newCardAfter,
          // If we're adding a new card, remove any newLine that might be there
          newLineAfter: newWords[index].newCardAfter ? newWords[index].newLineAfter : false,
        };

        return { ...prev, words: newWords };
      });
    },
    [setTranscript],
  );

  // Handle right click - remove formatting
  const handleWordRightClick = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.preventDefault();

      setTranscript((prev) => {
        if (!prev) return null;

        const newWords = [...prev.words];
        newWords[index] = {
          ...newWords[index],
          newLineAfter: false,
          newCardAfter: false,
        };

        return { ...prev, words: newWords };
      });
    },
    [setTranscript],
  );

  // Enhanced preview section in TranscriptEditor.tsx
  const { subtitles } = useMemo(() => generateSrt(transcript), [transcript]);

  return (
    <div className="mb-8 flex w-full flex-col gap-y-4">
      <div className="flex flex-row items-center justify-between rounded-lg bg-white p-6 shadow-md">
        <div>
          <h2 className="mb-4 text-xl font-bold">Edit Transcript</h2>
          <div className="mb-4 text-sm text-gray-600">
            <p>
              • Single-click a word to mark a{" "}
              <span className={getWordClasses(false, true)}>new line</span>
            </p>
            <p>
              • Double-click a word to mark a new{" "}
              <span className={getWordClasses(true, false)}>subtitle card</span>
            </p>
            <p>• Right-click a word to remove formatting</p>
          </div>
        </div>
        {children}
      </div>

      <div className="@container grid h-[calc(100vh-80px)] grid-cols-8 gap-2">
        {/* Transcript Section */}
        <div className="col-span-5 rounded-lg bg-white p-4 shadow-md @md:h-[98cqh] @lg:h-[98cqh]">
          <h2 className="mb-4 text-xl font-bold">Transcript</h2>
          <div className="h-[92cqh] overflow-y-scroll p-4 leading-relaxed">
            {transcript.words
              .map((word, originalIndex) => {
                if (word.type === "word") {
                  return (
                    <WordElement
                      key={originalIndex}
                      word={word}
                      index={originalIndex}
                      onClick={() => handleWordClick(originalIndex)}
                      onDoubleClick={() => handleWordDoubleClick(originalIndex)}
                      onRightClick={(e) => handleWordRightClick(e, originalIndex)}
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
