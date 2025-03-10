import { FormattedTranscript, FormattedWord, SRTSubtitle } from "@types";
import { secondsToSrtTime } from "./time";
import { Settings } from "@contexts/SettingsContext";

// Detect when there is a pause before a line.
const PAUSE_DETECTION_THRESHOLD = 0.9;
const PAUSE_ADJUSTMENT_CHARACTER_DURATION = 0.09;
const PAUSE_ADJUSTMENT_MINIMUM_DURATION_HEAD = PAUSE_ADJUSTMENT_CHARACTER_DURATION * 5;
const PAUSE_ADJUSTMENT_MINIMUM_DURATION_TAIL = PAUSE_ADJUSTMENT_CHARACTER_DURATION * 8;

const AGGRESSIVE_EM_DASH_PUNCTUATION = [".", "!", "?"];
const LAX_EM_DASH_PUNCTUATION = [",", ".", "!", "?", ":", ";"];

const getDuration = (word: FormattedWord) => word.end - word.start;
const getAlternativeDuration = (text: string, trimMode: "head" | "tail"): number =>
  Math.max(
    text.length * PAUSE_ADJUSTMENT_CHARACTER_DURATION,
    trimMode === "head"
      ? PAUSE_ADJUSTMENT_MINIMUM_DURATION_HEAD
      : PAUSE_ADJUSTMENT_MINIMUM_DURATION_TAIL,
  );

// Get the actual text to use based on original or revised
const getWordText = (word: FormattedWord): string => {
  return word.revisedText || word.text;
};

// Generate SRT content
export const generateSrt = (
  transcript: FormattedTranscript,
  settings: Settings,
): { srtContent: string; subtitles: SRTSubtitle[] } => {
  const words = transcript.words.filter((word) => word.type === "word");
  const subtitles: SRTSubtitle[] = [];

  let currentSubtitle: SRTSubtitle | null = null;
  let currentText = "";

  for (let i = 0; i < words.length; i++) {
    const curWord = words.at(i)!; // We're in the loop, the word will always exist.
    const prevWord = words.at(i - 1);

    // Adjust start time for words with long durations (pauses before them)
    let adjustedStart = curWord.start;
    let adjustedEnd = curWord.end;

    if (getDuration(curWord) > PAUSE_DETECTION_THRESHOLD) {
      if (prevWord?.newCardAfter) {
        // If the previous word was marked with newCardAfter, we should adjust the start time.
        adjustedStart = Math.max(
          curWord.end - getAlternativeDuration(getWordText(curWord), "head"),
          curWord.start,
        );
      } else if (curWord?.newCardAfter) {
        // If the current word is marked with newCardAfter, we should adjust the end time.
        adjustedEnd = Math.min(
          curWord.start + getAlternativeDuration(getWordText(curWord), "tail"),
          curWord.end,
        );
      }
    }

    // Start a new subtitle if it's the first word or the previous word was marked with newCardAfter
    if (i === 0 || (i > 0 && prevWord?.newCardAfter)) {
      // Save the previous subtitle if it exists
      if (currentSubtitle) {
        // Apply em dash formatting if enabled in settings
        if (settings.sentenceCardBreakDash && i > 0 && prevWord?.newCardAfter) {
          // Get the last character of the current text
          const lastChar = currentText.trim().slice(-1);

          const isAggressive = settings.aggressiveEmDash;
          const punctuation = isAggressive
            ? AGGRESSIVE_EM_DASH_PUNCTUATION
            : LAX_EM_DASH_PUNCTUATION;

          // Check if it doesn't end with sentence-ending punctuation
          if (!punctuation.includes(lastChar)) {
            // Remove trailing comma, colon, or semicolon if present
            if ([",", ":", ";"].includes(lastChar)) {
              currentText = currentText.trim().slice(0, -1);
            }

            // Add em dash
            currentText = currentText.trim() + "—";
          }
        }

        currentSubtitle.text = currentText.trim();
        subtitles.push(currentSubtitle);
      }

      // Start a new subtitle with adjusted start time
      currentSubtitle = {
        index: subtitles.length + 1,
        startTime: secondsToSrtTime(adjustedStart),
        endTime: secondsToSrtTime(adjustedEnd),
        text: "",
      };

      // Check if we need to add an em dash at the beginning
      if (
        settings.matchingEmDash &&
        subtitles.length > 0 &&
        subtitles[subtitles.length - 1].text.trim().endsWith("—")
      ) {
        currentText = "—" + getWordText(curWord);
      } else {
        currentText = getWordText(curWord);
      }
    } else {
      // If the previous word was marked with newLineAfter, add a line break
      if (i > 0 && prevWord?.newLineAfter) {
        currentText += "\n" + getWordText(curWord);
      } else {
        // Add space or not based on punctuation
        const punctuation = [",", ".", "!", "?", ":", ";"];
        const wordText = getWordText(curWord);
        if (punctuation.includes(wordText)) {
          currentText += wordText;
        } else {
          currentText += " " + wordText;
        }
      }

      // Update the end time
      if (currentSubtitle) {
        currentSubtitle.endTime = secondsToSrtTime(adjustedEnd);
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

  return { srtContent, subtitles };
};
