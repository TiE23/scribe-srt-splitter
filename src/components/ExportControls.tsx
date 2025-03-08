'use client';

import { useCallback } from 'react';
import { FormattedTranscript, SRTSubtitle } from '@/types';

interface ExportControlsProps {
  transcript: FormattedTranscript;
}

export default function ExportControls({ transcript }: ExportControlsProps) {
  // Convert seconds to SRT timestamp format (00:00:00,000)
  const secondsToSrtTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
  }, []);

  // Generate SRT content
  const generateSrtContent = useCallback(() => {
    const words = transcript.words.filter((word) => word.type === 'word');
    const subtitles: SRTSubtitle[] = [];

    let currentSubtitle: SRTSubtitle | null = null;
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      // Start a new subtitle if it's the first word or the previous word was marked with newCardAfter
      if (i === 0 || (i > 0 && words[i - 1].newCardAfter)) {
        // Save the previous subtitle if it exists
        if (currentSubtitle) {
          currentSubtitle.text = currentText.trim();
          subtitles.push(currentSubtitle);
        }

        // Start a new subtitle
        currentSubtitle = {
          index: subtitles.length + 1,
          startTime: secondsToSrtTime(word.start),
          endTime: secondsToSrtTime(word.end),
          text: '',
        };

        currentText = word.text;
      } else {
        // If the previous word was marked with newLineAfter, add a line break
        if (i > 0 && words[i - 1].newLineAfter) {
          currentText += '\n' + word.text;
        } else {
          // Add space or not based on punctuation
          const punctuation = [',', '.', '!', '?', ':', ';'];
          if (punctuation.includes(word.text)) {
            currentText += word.text;
          } else {
            currentText += ' ' + word.text;
          }
        }

        // Update the end time
        if (currentSubtitle) {
          currentSubtitle.endTime = secondsToSrtTime(word.end);
        }
      }
    }

    // Add the last subtitle
    if (currentSubtitle) {
      currentSubtitle.text = currentText.trim();
      subtitles.push(currentSubtitle);
    }

    // Format SRT content
    let srtContent = '';
    for (const sub of subtitles) {
      srtContent += `${sub.index}\n`;
      srtContent += `${sub.startTime} --> ${sub.endTime}\n`;
      srtContent += `${sub.text}\n\n`;
    }

    return srtContent;
  }, [transcript, secondsToSrtTime]);

  // Export handlers remain the same...
  const handleExportJson = () => {
    const jsonContent = JSON.stringify(transcript, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript_formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportSrt = () => {
    const srtContent = generateSrtContent();
    const blob = new Blob([srtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'subtitle.srt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className='w-full max-w-4xl'>
      <div className='flex justify-center space-x-4'>
        <button
          onClick={handleExportJson}
          className='rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white shadow transition-colors hover:bg-blue-600'
        >
          Export JSON
        </button>
        <button
          onClick={handleExportSrt}
          className='rounded-lg bg-green-500 px-6 py-3 font-semibold text-white shadow transition-colors hover:bg-green-600'
        >
          Export SRT
        </button>
      </div>
    </div>
  );
}
