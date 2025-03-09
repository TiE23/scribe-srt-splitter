"use client";

import { FormattedTranscript } from "@types";
import { generateSrt } from "@utils/export";
import { useSettings } from "@contexts/SettingsContext";

interface ExportControlsProps {
  transcript: FormattedTranscript;
  uploadedFileName: string | null;
}

export default function ExportControls({ transcript, uploadedFileName }: ExportControlsProps) {
  const { settings } = useSettings();

  const handleExportJson = () => {
    const jsonContent = JSON.stringify(transcript, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const fileName = uploadedFileName
      ? `${uploadedFileName}.proj.json`
      : "transcript_formatted.proj.json";

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportSrt = () => {
    const { srtContent } = generateSrt(transcript, settings);
    const blob = new Blob([srtContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const fileName = uploadedFileName ? `${uploadedFileName}.srt` : "subtitle.srt";

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
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
          className="cursor-pointer rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white shadow transition-colors hover:bg-blue-600"
        >
          Save JSON
        </button>
        <button
          onClick={handleExportSrt}
          className="cursor-pointer rounded-lg bg-green-500 px-6 py-3 font-semibold text-white shadow transition-colors hover:bg-green-600"
        >
          Export SRT
        </button>
      </div>
    </div>
  );
}
