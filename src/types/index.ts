export interface ScribeWord {
  text: string;
  start: number;
  end: number;
  type: "word" | "spacing";
  speaker_id?: string;
  speaker_name?: string;
}

export interface ScribeTranscript {
  language_code: string;
  language_probability: number;
  words: ScribeWord[];
}

// Enhanced structure with formatting
export interface FormattedWord extends ScribeWord {
  newLineAfter?: boolean;
  newCardAfter?: boolean;
  revisedText?: string;
}

export interface FormattedTranscript extends ScribeTranscript {
  words: FormattedWord[];
}

// SRT format
export interface SRTSubtitle {
  index: number;
  startTime: string; // Format: 00:00:00,000
  endTime: string;
  text: string;
}
