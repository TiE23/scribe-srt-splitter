import {
  ScribeV1TranscriptSchema,
  ScribeV2TranscriptSchema,
  ProjectTranscriptSchema,
  type ScribeV1Transcript,
  type ScribeV2Transcript,
  type ProjectTranscript,
  type ProjectWord,
  WordType,
} from "@/types";

export type ParseResult =
  | {
      success: true;
      data: ProjectTranscript;
      format: "scribe-v1" | "scribe-v2" | "project";
    }
  | {
      success: false;
      error: string;
      details?: string;
    };

function convertScribeV1ToProject(transcript: ScribeV1Transcript): ProjectTranscript {
  return {
    words: transcript.words.map(
      (word): ProjectWord => ({
        type: word.type,
        text: word.text,
        start: word.start,
        end: word.end,
        newLineAfter: false,
        newCardAfter: false,
      }),
    ),
  };
}

function convertScribeV2ToProject(transcription: ScribeV2Transcript): ProjectTranscript {
  const allWords: ProjectWord[] = [];

  transcription.segments.forEach((segment) => {
    segment.words.forEach((word) => {
      allWords.push({
        type: word.text.trim() === "" ? WordType.SPACING : WordType.WORD,
        text: word.text,
        start: word.start_time,
        end: word.end_time,
        newLineAfter: false,
        newCardAfter: false,
      });
    });
  });

  return {
    words: allWords,
  };
}

/**
 * Normalizes a older project files to the current project format.
 */
function normalizeProject(transcript: ProjectTranscript): ProjectTranscript {
  return {
    ...transcript,
    words: transcript.words.map(
      (word): ProjectWord => ({
        ...word,
        newLineAfter: word.newLineAfter || word.isNewLine || false,
        newCardAfter: word.newCardAfter || word.isNewCard || false,

        // Remove legacy fields.
        isNewLine: undefined,
        isNewCard: undefined,
        speaker_id: undefined,
        speaker_name: undefined,
      }),
    ),

    // Remove legacy fields.
    language_code: undefined,
    language_probability: undefined,
  };
}

export function parseTranscript(input: string | unknown): ParseResult {
  try {
    const data = typeof input === "string" ? JSON.parse(input) : input;

    // Try parsing as each format using Zod's safeParse
    // Order matters: try most specific schemas first

    // Try Scribe v2 format.
    const scribeV2Result = ScribeV2TranscriptSchema.safeParse(data);
    if (scribeV2Result.success) {
      console.log("Detected Scribe v2 format");
      return {
        success: true,
        data: convertScribeV2ToProject(scribeV2Result.data),
        format: "scribe-v2",
      };
    }

    // Try Scribe v1 format.
    const scribeV1Result = ScribeV1TranscriptSchema.safeParse(data);
    if (scribeV1Result.success) {
      console.log("Detected Scribe v1 format");
      return {
        success: true,
        data: convertScribeV1ToProject(scribeV1Result.data),
        format: "scribe-v1",
      };
    }

    // Try Project format.
    const formattedResult = ProjectTranscriptSchema.safeParse(data);
    if (formattedResult.success) {
      console.log("Detected project transcript format");
      return {
        success: true,
        data: normalizeProject(formattedResult.data),
        format: "project",
      };
    }

    // If none of the schemas match, return detailed error information
    return {
      success: false,
      error: "Unknown or unsupported transcript format",
      details: [
        "Scribe v2 errors: " + scribeV2Result.error.message,
        "Scribe v1 errors: " + scribeV1Result.error.message,
        "Project errors: " + formattedResult.error.message,
      ].join("\n\n\n\n"),
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        success: false,
        error: "Invalid JSON format",
        details: error.message,
      };
    }
    return {
      success: false,
      error: "Unexpected error during parsing",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
