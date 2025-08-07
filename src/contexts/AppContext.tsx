"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { localStorageUtils } from "@utils/browser";
import { AppSettings, ProjectTranscript } from "@types";

// Default settings
const defaultAppSettings: AppSettings = {
  sentenceCardBreakDash: false,
  matchingEmDash: false,
  aggressiveEmDash: false,
  autoEllipsesPairs: false,
  autoCommaToEllipses: false,
  centerText: false,
  rule: 0,
};

// Define the context shape
interface AppContextType {
  projectTranscript: ProjectTranscript | null;
  setProjectTranscript: React.Dispatch<React.SetStateAction<ProjectTranscript | null>>;
  uploadedFileName: string | null;
  setUploadedFileName: React.Dispatch<React.SetStateAction<string | null>>;
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  resetSettings: () => void;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Storage key
const SETTINGS_STORAGE_KEY = "scribe-srt-settings";

// Provider component
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [projectTranscript, setProjectTranscript] = useState<ProjectTranscript | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(defaultAppSettings);

  // Load settings from localStorage on initial render
  useEffect(() => {
    const storedSettings = localStorageUtils.getItem(SETTINGS_STORAGE_KEY);

    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings((_) => ({
          ...defaultAppSettings, // Always include defaults for new settings
          ...parsedSettings,
        }));
      } catch (error) {
        console.error("Failed to parse settings from localStorage:", error);
      }
    }

    // Listen for storage changes (for multi-tab support)
    const unsubscribe = localStorageUtils.addStorageListener(SETTINGS_STORAGE_KEY, (newValue) => {
      if (newValue) {
        try {
          const parsedSettings = JSON.parse(newValue);
          setSettings((_) => ({
            ...defaultAppSettings,
            ...parsedSettings,
          }));
        } catch (error) {
          console.error("Failed to parse settings from storage event:", error);
        }
      } else {
        // If settings were removed, revert to defaults
        setSettings(defaultAppSettings);
      }
    });

    return unsubscribe;
  }, []);

  // Update a single setting
  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((current) => {
      const newSettings = { ...current, [key]: value };
      // Save to localStorage
      localStorageUtils.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
      return newSettings;
    });
  };

  // Reset all settings to defaults
  const resetSettings = () => {
    setSettings(defaultAppSettings);
    localStorageUtils.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultAppSettings));
  };

  return (
    <AppContext.Provider
      value={{
        projectTranscript,
        setProjectTranscript,
        uploadedFileName,
        setUploadedFileName,
        settings,
        updateSetting,
        resetSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for using the settings
export function useSettings() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
