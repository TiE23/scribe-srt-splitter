import { FormattedTranscript, SRTSubtitle } from "@types";
import { secondsToSrtTime } from "./time";

// Detect when there is a pause before a line.
const PAUSE_DETECTION_THRESHOLD = 0.5;
const PAUSE_ADJUSTMENT_CHARACTER_DURATION = 0.04;
const PAUSE_ADJUSTMENT_MINIMUM_DURATION = PAUSE_ADJUSTMENT_CHARACTER_DURATION * 5;

// Generate SRT content
export const generateSrtContent = (transcript: FormattedTranscript) => {
  const words = transcript.words.filter((word) => word.type === "word");
  const subtitles: SRTSubtitle[] = [];

  let currentSubtitle: SRTSubtitle | null = null;
  let currentText = "";

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // Adjust start time for words with long durations (pauses before them)
    const wordDuration = word.end - word.start;
    const adjustedStart =
      wordDuration > PAUSE_DETECTION_THRESHOLD
        ? Math.max(
            word.end -
              Math.max(
                word.text.length * PAUSE_ADJUSTMENT_CHARACTER_DURATION,
                PAUSE_ADJUSTMENT_MINIMUM_DURATION,
              ),
            word.start,
          )
        : word.start;

    // Start a new subtitle if it's the first word or the previous word was marked with newCardAfter
    if (i === 0 || (i > 0 && words[i - 1].newCardAfter)) {
      // Save the previous subtitle if it exists
      if (currentSubtitle) {
        currentSubtitle.text = currentText.trim();
        subtitles.push(currentSubtitle);
      }

      // Start a new subtitle with adjusted start time
      currentSubtitle = {
        index: subtitles.length + 1,
        startTime: secondsToSrtTime(adjustedStart),
        endTime: secondsToSrtTime(word.end),
        text: "",
      };
      currentText = word.text;
    } else {
      // If the previous word was marked with newLineAfter, add a line break
      if (i > 0 && words[i - 1].newLineAfter) {
        currentText += "\n" + word.text;
      } else {
        // Add space or not based on punctuation
        const punctuation = [",", ".", "!", "?", ":", ";"];
        if (punctuation.includes(word.text)) {
          currentText += word.text;
        } else {
          currentText += " " + word.text;
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
  let srtContent = "";
  for (const sub of subtitles) {
    srtContent += `${sub.index}\n`;
    srtContent += `${sub.startTime} --> ${sub.endTime}\n`;
    srtContent += `${sub.text}\n\n`;
  }

  return srtContent;
};
