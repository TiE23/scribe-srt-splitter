'use client';

import { useCallback } from 'react';
import { FormattedTranscript } from '@/types';
import WordElement from './WordElement';
import { getWordClasses } from '@utils/styles';

interface TranscriptEditorProps {
  transcript: FormattedTranscript;
  setTranscript: React.Dispatch<React.SetStateAction<FormattedTranscript | null>>;
}

export default function TranscriptEditor({ transcript, setTranscript }: TranscriptEditorProps) {
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

  return (
    <div className='mb-8 w-full max-w-4xl'>
      <div className='rounded-lg bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-xl font-bold'>Edit Transcript</h2>
        <div className='mb-4 text-sm text-gray-600'>
          <p>
            • Single-click a word to mark a{' '}
            <span className={getWordClasses(false, true)}>new line</span>
          </p>
          <p>
            • Double-click a word to mark a new{' '}
            <span className={getWordClasses(true, false)}>subtitle card</span>
          </p>
          <p>• Right-click a word to remove formatting</p>
        </div>
        <div className='rounded-md bg-gray-50 p-4 leading-relaxed'>
          {transcript.words
            .map((word, originalIndex) => {
              if (word.type === 'word') {
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
    </div>
  );
}
