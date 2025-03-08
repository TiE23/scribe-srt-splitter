"use client";

import { useState } from "react";
import FileUploader from "@components/FileUploader";
import TranscriptEditor from "@components/TranscriptEditor";
import ExportControls from "@components/ExportControls";
import { FormattedTranscript } from "@types";

export default function Home() {
  const [transcript, setTranscript] = useState<FormattedTranscript | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleFileLoaded = (data: FormattedTranscript, fileName: string | null) => {
    setTranscript(data);
    setUploadedFileName(fileName);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8">
      {!transcript ? (
        <FileUploader onFileLoaded={handleFileLoaded} />
      ) : (
        <>
          <TranscriptEditor transcript={transcript} setTranscript={setTranscript}>
            <ExportControls transcript={transcript} uploadedFileName={uploadedFileName} />
          </TranscriptEditor>
        </>
      )}
    </main>
  );
}
