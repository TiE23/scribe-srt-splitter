import { z } from "zod";

/////////////////////////////////////////////////////////
// Scribe API v1 types
/////////////////////////////////////////////////////////
export const ScribeV1WordSchema = z.object({
  type: z.enum(["word", "spacing"]),
  text: z.string(),
  start: z.number(),
  end: z.number(),
  speaker_id: z.string().optional(),
  speaker_name: z.string().optional(),
});
export type ScribeV1Word = z.infer<typeof ScribeV1WordSchema>;

export const ScribeV1TranscriptSchema = z.object({
  language_code: z.string(),
  language_probability: z.number(),
  words: z.array(ScribeV1WordSchema),
});
export type ScribeV1Transcript = z.infer<typeof ScribeV1TranscriptSchema>;

/////////////////////////////////////////////////////////
// Scribe API v2 types
/////////////////////////////////////////////////////////
export const ScribeV2SpeakerSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const ScribeV2WordSchema = z.object({
  text: z.string(),
  start_time: z.number(),
  end_time: z.number(),
});

export const ScribeV2SegmentSchema = z.object({
  text: z.string(),
  start_time: z.number(),
  end_time: z.number(),
  speaker: ScribeV2SpeakerSchema,
  words: z.array(ScribeV2WordSchema),
});

export const ScribeV2TranscriptionSchema = z.object({
  language_code: z.string().nullable(),
  segments: z.array(ScribeV2SegmentSchema),
});

/////////////////////////////////////////////////////////
// Internal data format.
/////////////////////////////////////////////////////////
export const FormattedWordSchema = z.object({
  type: z.enum(["word", "spacing"]),
  text: z.string(),
  start: z.number(),
  end: z.number(),
  newLineAfter: z.boolean(),
  newCardAfter: z.boolean(),
  revisedText: z.string().optional(),
});
export type FormattedWord = z.infer<typeof FormattedWordSchema>;

export const FormattedTranscriptSchema = z.object({
  languageCode: z.string(),
  words: z.array(FormattedWordSchema),
});
export type FormattedTranscript = z.infer<typeof FormattedTranscriptSchema>;

// SRT format
export interface SRTSubtitle {
  index: number;
  startTime: string; // Format: 00:00:00,000
  endTime: string;
  text: string;
}
