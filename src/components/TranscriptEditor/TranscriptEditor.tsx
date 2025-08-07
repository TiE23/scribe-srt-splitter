"use client";

import { useState } from "react";
import { getWordClasses } from "@utils/styles";
import SettingsButton from "../SettingsButton";
import SettingsModal from "../SettingsModal";
import EditorSection from "./components/EditorSection";
import PreviewSection from "./components/PreviewSection";

export default function TranscriptEditor({ children }: React.PropsWithChildren) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex w-full flex-col gap-y-4 px-4 pt-4">
      <div className="flex flex-row items-center justify-between rounded-lg bg-white p-6 shadow-md">
        <div className="flex flex-col gap-y-4">
          <h2 className="text-xl font-bold">ElevenLabs Scribe JSON to Custom Timed SRT Tool</h2>
          <div className="flex flex-col gap-y-2 text-sm text-gray-600">
            <p>
              <strong>Click</strong> a word to cycle through formatting options:
            </p>
            <p className="ml-4">
              No formatting → <span className={getWordClasses(false, true)}>New line</span> →{" "}
              <span className={getWordClasses(true, false)}>New subtitle card</span> → No formatting
            </p>
            <p>
              <strong>Right-click</strong> on any word to edit its text.
            </p>
            <p className="ml-4">
              Press <kbd>Enter</kbd> to save or <kbd>Esc</kbd> to cancel. Save blank to reset. Enter
              &quot;<span className="font-mono">_</span>&quot; to force a blank.
            </p>
          </div>
        </div>

        <div className="flex items-center">
          {children}
          <SettingsButton onClick={() => setIsSettingsOpen(true)} />
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && <SettingsModal onClickClose={() => setIsSettingsOpen(false)} />}

      <div className="@container mb-4 grid grid-cols-8 gap-2">
        <EditorSection />
        <PreviewSection />
      </div>
    </div>
  );
}
