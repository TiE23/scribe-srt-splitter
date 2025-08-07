import { z } from "zod";

export enum WordType {
  WORD = "word",
  SPACING = "spacing",
  AUDIO_EVENT = "audio_event",
}

/////////////////////////////////////////////////////////
// Scribe API v1 Format
/////////////////////////////////////////////////////////
const ScribeV1WordSchema = z
  .object({
    text: z.string(),
    start: z.number(),
    end: z.number(),
    type: z.enum(WordType),
    speaker_id: z.string().optional(),
    speaker_name: z.string().optional(),
  })
  .strict();

export const ScribeV1TranscriptSchema = z
  .object({
    language_code: z.string(),
    language_probability: z.number(),
    words: z.array(ScribeV1WordSchema),
  })
  .strict();
export type ScribeV1Transcript = z.infer<typeof ScribeV1TranscriptSchema>;

/////////////////////////////////////////////////////////
// Scribe API v2 Format
/////////////////////////////////////////////////////////
const ScribeV2SpeakerSchema = z
  .object({
    id: z.string(),
    name: z.string(),
  })
  .strict();

const ScribeV2WordSchema = z
  .object({
    text: z.string(),
    start_time: z.number(),
    end_time: z.number(),
  })
  .strict();

const ScribeV2SegmentSchema = z
  .object({
    text: z.string(),
    start_time: z.number(),
    end_time: z.number(),
    speaker: ScribeV2SpeakerSchema,
    words: z.array(ScribeV2WordSchema),
  })
  .strict();

export const ScribeV2TranscriptSchema = z
  .object({
    language_code: z.string().nullable(),
    segments: z.array(ScribeV2SegmentSchema),
  })
  .strict();
export type ScribeV2Transcript = z.infer<typeof ScribeV2TranscriptSchema>;

/////////////////////////////////////////////////////////
// Project format
/////////////////////////////////////////////////////////
const ProjectWordSchema = z
  .object({
    text: z.string(),
    start: z.number(),
    end: z.number(),
    type: z.enum(WordType),
    newLineAfter: z.boolean().optional(),
    newCardAfter: z.boolean().optional(),
    revisedText: z.string().optional(),

    // Legacy only.
    speaker_id: z.string().optional(),
    speaker_name: z.string().optional(),
    isNewLine: z.boolean().optional(),
    isNewCard: z.boolean().optional(),
  })
  .strict();
export type ProjectWord = z.infer<typeof ProjectWordSchema>;

export const ProjectTranscriptSchema = z
  .object({
    words: z.array(ProjectWordSchema),

    // Legacy only.
    language_code: z.string().optional(),
    language_probability: z.number().optional(),
  })
  .strict();
export type ProjectTranscript = z.infer<typeof ProjectTranscriptSchema>;

/////////////////////////////////////////////////////////
// SRT format
/////////////////////////////////////////////////////////
export interface SRTSubtitle {
  index: number;
  startTime: string; // Format: 00:00:00,000
  endTime: string;
  adjustedStart: number;
  adjustedEnd: number;
  text: string;
}

/////////////////////////////////////////////////////////
// App Types
/////////////////////////////////////////////////////////
export interface AppSettings {
  sentenceCardBreakDash: boolean;
  matchingEmDash: boolean;
  aggressiveEmDash: boolean;
  autoEllipsesPairs: boolean;
  autoCommaToEllipses: boolean;
  rule: number;
  centerText: boolean;
  hoverFeature: boolean;
  // Add more settings here as needed
}

export type HoverStateMode = "editor" | "preview";

export interface HoverState {
  mode: HoverStateMode;
  start: number;
  end: number;
}
