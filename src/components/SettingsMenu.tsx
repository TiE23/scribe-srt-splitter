import { useSettings } from "@contexts/SettingsContext";

export default function SettingsMenu() {
  const { settings, updateSetting, resetSettings } = useSettings();

  return (
    <div className="flex flex-col gap-y-2 p-4">
      <div className="mb-4 flex flex-col gap-y-2">
        <label className="flex cursor-pointer items-center gap-x-2">
          <input
            type="checkbox"
            checked={settings.sentenceCardBreakDash}
            onChange={(e) => updateSetting("sentenceCardBreakDash", e.target.checked)}
            className="rounded"
          />
          <p className="ml-2 font-light">
            Append an em dash (—) to a the end of a card if made within a sentence.
          </p>
        </label>

        <label className="flex cursor-pointer items-center gap-x-2">
          <input
            type="checkbox"
            checked={settings.matchingEmDash}
            onChange={(e) => updateSetting("matchingEmDash", e.target.checked)}
            className="rounded"
          />
          <p className="ml-2 font-light">
            Prefix an em dash (—) to a the start of a card following a previous em dash.
          </p>
        </label>

        <label className="flex cursor-pointer items-center gap-x-2">
          <input
            type="checkbox"
            checked={settings.aggressiveEmDash}
            onChange={(e) => updateSetting("aggressiveEmDash", e.target.checked)}
            className="rounded"
          />
          <p className="ml-2 font-light">Appended em dashes (—) strip punctuation.</p>
        </label>
      </div>

      <button
        onClick={resetSettings}
        className="cursor-pointer rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
      >
        Reset to Defaults
      </button>
    </div>
  );
}
