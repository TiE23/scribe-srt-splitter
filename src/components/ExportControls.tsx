"use client";

import { FormattedTranscript } from "@/types";
import { generateSrtContent } from "@utils/export";

interface ExportControlsProps {
  transcript: FormattedTranscript;
}

export default function ExportControls({ transcript }: ExportControlsProps) {
  // Export handlers remain the same...
  const handleExportJson = () => {
    const jsonContent = JSON.stringify(transcript, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transcript_formatted.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportSrt = () => {
    const srtContent = generateSrtContent(transcript);
    const blob = new Blob([srtContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "subtitle.srt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleExportJson}
          className="rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white shadow transition-colors hover:bg-blue-600"
        >
          Export JSON
        </button>
        <button
          onClick={handleExportSrt}
          className="rounded-lg bg-green-500 px-6 py-3 font-semibold text-white shadow transition-colors hover:bg-green-600"
        >
          Export SRT
        </button>
      </div>
    </div>
  );
}
