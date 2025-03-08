'use client';

import { useCallback } from 'react';
import { FormattedTranscript } from '@types';
import WordElement from './WordElement';
import { getWordClasses } from '@utils/styles';

interface TranscriptEditorProps {
  transcript: FormattedTranscript;
  setTranscript: React.Dispatch<React.SetStateAction<FormattedTranscript | null>>;
}

export default function TranscriptEditor({ transcript, setTranscript }: TranscriptEditorProps) {
  // Handle single click - add newline
  const handleWordClick = useCallback(
    (index: number) => {
      console.log('handleWordClick', index);
      setTranscript((prev) => {
        if (!prev) return null;

        const newWords = [...prev.words];
        newWords[index] = {
          ...newWords[index],
          isNewLine: !newWords[index].isNewLine,
          isNewCard: newWords[index].isNewCard ? false : newWords[index].isNewCard,
        };

        return { ...prev, words: newWords };
      });
    },
    [setTranscript],
  );

  // Handle double click - add new subtitle card
  const handleWordDoubleClick = useCallback(
    (index: number) => {
      setTranscript((prev) => {
        if (!prev) return null;

        const newWords = [...prev.words];
        newWords[index] = {
          ...newWords[index],
          isNewCard: !newWords[index].isNewCard,
          isNewLine: newWords[index].isNewCard ? newWords[index].isNewLine : false,
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
          isNewLine: false,
          isNewCard: false,
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
            .filter((word) => word.type === 'word')
            .map((word, index) => (
              <WordElement
                key={index}
                word={word}
                index={index}
                onClick={() => handleWordClick(index)}
                onDoubleClick={() => handleWordDoubleClick(index)}
                onRightClick={(e) => handleWordRightClick(e, index)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
