"use client";

import { useState, useCallback } from "react";
import { ProjectTranscript } from "@types";
import { parseTranscript } from "@/utils/transcriptParser";
import clsx from "clsx";
import { useSettings } from "@contexts/AppContext";

export default function FileUploader() {
  const { setProjectTranscript, setUploadedFileName } = useSettings();

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileLoaded = useCallback(
    (data: ProjectTranscript, fileName: string | null) => {
      setUploadedFileName(fileName);
      setProjectTranscript(data);
    },
    [setUploadedFileName, setProjectTranscript],
  );

  const processFile = useCallback(
    (file: File) => {
      const reader = new FileReader();

      // Extract the filename without extension.
      const fullFileName = file.name;
      const fileNameWithoutExt = fullFileName.replace(/\.[^/.]+$/, "").replace(/\.proj$/, "");

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parseResult = parseTranscript(content);

          if (!parseResult.success) {
            setError(
              `Failed to parse file: ${parseResult.error}${parseResult.details ? ` (${parseResult.details})` : ""}`,
            );
            return;
          }

          handleFileLoaded(parseResult.data, fileNameWithoutExt);
          setError(null);
        } catch (err) {
          setError("Unexpected error occurred while processing the file.");
          console.error(err);
        }
      };

      reader.readAsText(file);
    },
    [handleFileLoaded],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type === "application/json" || file.name.endsWith(".json")) {
          processFile(file);
        } else {
          setError("Please upload a JSON file.");
        }
      }
    },
    [processFile],
  );

  return (
    <div className="mt-4 flex max-w-[50ch] flex-col items-center gap-y-4">
      <div className="flex flex-col gap-y-2">
        <h2 className="text-xl font-bold">Scribe Transcript to Custom Timed SRT Tool</h2>
        <p className="text-center text-sm text-gray-600/20 italic">Version: 2025-08-04A</p>
      </div>

      <div
        className={clsx(
          "w-full max-w-2xl rounded-lg border-2 border-dashed bg-white p-12 text-center transition-colors",
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-300",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center">
          <svg
            className="mb-4 h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3-3m0 0l3 3m-3-3v12"
            />
          </svg>
          <p className="mb-2 text-lg font-semibold">Drag and drop your transcript JSON file here</p>
          <p className="mb-4 text-sm text-gray-500">
            Supports Scribe v1, v2, or formatted transcript files
          </p>
          <input
            type="file"
            className="hidden"
            accept=".json,.proj.json,application/json"
            onChange={(e) => e.target.files && e.target.files[0] && processFile(e.target.files[0])}
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Select File
          </label>

          {error && <div className="mt-4 text-red-500">{error}</div>}
        </div>
      </div>

      <p className="text-gray-500 italic">
        <strong>Privacy Note:</strong> This tool runs entirely in your browser. No data is sent to
        any server.
      </p>
    </div>
  );
}
