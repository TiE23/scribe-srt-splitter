"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { localStorageUtils } from "@utils/browser";

// Define the settings interface
export interface Settings {
  sentenceCardBreakDash: boolean;
  matchingEmDash: boolean;
  aggressiveEmDash: boolean;
  // Add more settings here as needed
}

// Default settings
const defaultSettings: Settings = {
  sentenceCardBreakDash: false,
  matchingEmDash: false,
  aggressiveEmDash: false,
};

// Define the context shape
interface SettingsContextType {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
}

// Create the context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Storage key
const SETTINGS_STORAGE_KEY = "scribe-srt-settings";

// Provider component
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from localStorage on initial render
  useEffect(() => {
    const storedSettings = localStorageUtils.getItem(SETTINGS_STORAGE_KEY);

    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings((_) => ({
          ...defaultSettings, // Always include defaults for new settings
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
            ...defaultSettings,
            ...parsedSettings,
          }));
        } catch (error) {
          console.error("Failed to parse settings from storage event:", error);
        }
      } else {
        // If settings were removed, revert to defaults
        setSettings(defaultSettings);
      }
    });

    return unsubscribe;
  }, []);

  // Update a single setting
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((current) => {
      const newSettings = { ...current, [key]: value };
      // Save to localStorage
      localStorageUtils.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
      return newSettings;
    });
  };

  // Reset all settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorageUtils.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook for using the settings
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
