"use client";

import { useState } from "react";
import FileUploader from "@components/FileUploader";
import TranscriptEditor from "@components/TranscriptEditor";
import ExportControls from "@components/ExportControls";
import { ProjectTranscript } from "@types";

export default function Home() {
  const [projectTranscript, setProjectTranscript] = useState<ProjectTranscript | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleFileLoaded = (data: ProjectTranscript, fileName: string | null) => {
    setProjectTranscript(data);
    setUploadedFileName(fileName);
  };

  return (
    <main className="flex min-h-screen flex-col items-center">
      {!projectTranscript ? (
        <FileUploader onFileLoaded={handleFileLoaded} />
      ) : (
        <TranscriptEditor
          projectTranscript={projectTranscript}
          setProjectTranscript={setProjectTranscript}
        >
          <ExportControls
            projectTranscript={projectTranscript}
            uploadedFileName={uploadedFileName}
          />
        </TranscriptEditor>
      )}
    </main>
  );
}
