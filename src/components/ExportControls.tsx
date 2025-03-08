"use client";

import { useCallback } from 'react';
import { FormattedTranscript, SRTSubtitle } from '@types';

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
    const words = transcript.words.filter(word => word.type === 'word');
    const subtitles: SRTSubtitle[] = [];

    let currentSubtitle: SRTSubtitle | null = null;
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      // Start a new subtitle if it's the first word or marked as a new card
      if (i === 0 || word.isNewCard) {
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
          text: ''
        };

        currentText = word.text;
      } else {
        // If it's a new line, add a line break
        if (word.isNewLine) {
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

  // Export handlers
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
    <div className="w-full max-w-4xl">
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleExportJson}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition-colors"
        >
          Export JSON
        </button>
        <button
          onClick={handleExportSrt}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition-colors"
        >
          Export SRT
        </button>
      </div>
    </div>
  );
}
