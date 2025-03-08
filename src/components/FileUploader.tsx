"use client";

import { useState, useCallback } from "react";
import { FormattedTranscript } from "@types";

interface FileUploaderProps {
  onFileLoaded: (data: FormattedTranscript, fileName: string | null) => void;
}

export default function FileUploader({ onFileLoaded }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    (file: File) => {
      const reader = new FileReader();

      // Extract the filename without extension
      const fullFileName = file.name;
      const fileNameWithoutExt = fullFileName.replace(/\.[^/.]+$/, "").replace(/\.proj$/, "");

      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);

          // Check if it's a valid Scribe transcript
          if (!json.words || !Array.isArray(json.words)) {
            throw new Error("Invalid transcript format");
          }

          // Convert to our format if it's not already
          const formattedTranscript: FormattedTranscript = {
            ...json,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            words: json.words.map((word: any) => ({
              ...word,
              isNewLine: word.isNewLine || false,
              isNewCard: word.isNewCard || false,
            })),
          };

          onFileLoaded(formattedTranscript, fileNameWithoutExt);
          setError(null);
        } catch (err) {
          setError("Failed to parse file. Please ensure it's a valid JSON transcript.");
          console.error(err);
        }
      };

      reader.readAsText(file);
    },
    [onFileLoaded],
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
    <div
      className={`w-full max-w-2xl rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-300"
      }`}
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
        <p className="mb-2 text-lg font-semibold">Drag and drop your JSON file here</p>
        <p className="mb-4 text-sm text-gray-500">or click to browse files</p>
        <input
          type="file"
          className="hidden"
          accept=".json,application/json"
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
  );
}
