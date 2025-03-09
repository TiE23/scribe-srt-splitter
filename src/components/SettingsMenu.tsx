import { useSettings } from "@contexts/SettingsContext";

export default function SettingsMenu() {
  const { settings, updateSetting, resetSettings } = useSettings();

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <div className="mb-4">
        <label className="flex cursor-pointer items-center gap-x-2">
          <input
            type="checkbox"
            checked={settings.sentenceCardBreakDash}
            onChange={(e) => updateSetting("sentenceCardBreakDash", e.target.checked)}
            className="rounded"
          />
          <p className="ml-2 font-light">
            Append an em dash (—) to a the end of a card if not at the end of a sentence.
          </p>
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
