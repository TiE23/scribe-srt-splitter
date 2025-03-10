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

        <label className="flex cursor-pointer items-center gap-x-2">
          <input
            type="checkbox"
            checked={settings.autoCommaToEllipses}
            onChange={(e) => updateSetting("autoCommaToEllipses", e.target.checked)}
            className="rounded"
          />
          <p className="ml-2 font-light">
            Automatically replace commas with ellipses (...) on revised new cards.
          </p>
        </label>

        <label className="flex cursor-pointer items-center gap-x-2">
          <input
            type="checkbox"
            checked={settings.autoEllipsesPairs}
            onChange={(e) => updateSetting("autoEllipsesPairs", e.target.checked)}
            className="rounded"
          />
          <p className="ml-2 font-light">
            Automatically add ellipses (...) on revised new cards to the next word.
          </p>
        </label>

        <div className="mb-2 border-t border-gray-200 pt-2" />

        {/* Rule setting with number input */}
        <div className="flex flex-col gap-y-1">
          <label htmlFor="rule-input" className="font-medium">
            Rule Position
          </label>
          <div className="flex items-center">
            <input
              id="rule-input"
              type="number"
              min={0}
              max={100}
              step={1}
              value={settings.rule || 0}
              onChange={(e) => {
                const value = Math.min(300, Math.max(0, parseInt(e.target.value) || 0));
                updateSetting("rule", value);
              }}
              className="w-20 rounded border border-gray-300 px-2 py-1"
            />
            <p className="ml-3 font-light">Position of char rule guide (0 = off)</p>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-x-2">
          <input
            type="checkbox"
            checked={settings.centerText}
            onChange={(e) => updateSetting("centerText", e.target.checked)}
            className="rounded"
          />
          <p className="ml-2 font-light">Center the text in subtitle preview cards.</p>
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
