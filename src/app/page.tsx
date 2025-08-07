"use client";

import { useState } from "react";
import FileUploader from "@components/FileUploader";
import TranscriptEditor from "@components/TranscriptEditor/TranscriptEditor";
import ExportControls from "@components/ExportControls";
import { ProjectTranscript } from "@types";
import { useSettings } from "@contexts/AppContext";

export default function Home() {
  const { projectTranscript } = useSettings();

  return (
    <main className="flex min-h-screen flex-col items-center">
      {!!projectTranscript ? (
        <TranscriptEditor>
          <ExportControls />
        </TranscriptEditor>
      ) : (
        <FileUploader />
      )}
    </main>
  );
}
