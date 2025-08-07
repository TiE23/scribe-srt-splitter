"use client";

import { useSettings } from "@contexts/AppContext";
import { generateSrt } from "@utils/export";
import clsx from "clsx";
import { useMemo } from "react";

export default function PreviewSection() {
  const { projectTranscript, setHoverState, amIHoveredPreview, settings } = useSettings();

  const srt = useMemo(() => {
    if (!projectTranscript) return;
    return generateSrt(projectTranscript, settings);
  }, [projectTranscript, settings]);

  return (
    <div className="col-span-3 h-full rounded-lg bg-white p-4 shadow-md">
      <h2 className="mb-4 text-xl font-bold select-none">Preview</h2>
      <div className="flex h-[90cqh] flex-grow flex-col overflow-x-hidden overflow-y-scroll">
        {srt?.subtitles.map((subtitle, index) => (
          <div
            key={index}
            className={clsx(
              "relative mb-4 overflow-clip rounded-md border-l-4 p-3",
              // "border-purple-500 bg-purple-50",
              amIHoveredPreview(subtitle.adjustedStart, subtitle.adjustedEnd)
                ? "border-red-500 bg-red-50"
                : "border-purple-500 bg-purple-50",
            )}
            onMouseEnter={() =>
              setHoverState({
                mode: "preview",
                start: subtitle.adjustedStart,
                end: subtitle.adjustedEnd,
              })
            }
            onMouseLeave={() => setHoverState(null)}
          >
            <div className="mb-1 text-xs font-semibold text-purple-500">Subtitle {index + 1}</div>
            <div className="mb-2 text-xs text-gray-500">
              {subtitle.startTime} → {subtitle.endTime}
            </div>
            <div className="relative w-fit text-base/6 whitespace-pre-line">
              {settings.rule > 0 ? (
                <div
                  className="absolute h-full w-px bg-purple-600/30"
                  style={{ left: `${settings.rule * 5}px` }}
                />
              ) : null}
              <div className={clsx(settings.centerText && "text-center")}>{subtitle.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
