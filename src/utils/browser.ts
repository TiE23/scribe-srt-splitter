type StorageListener = (newValue: string | null) => void;

export const localStorageUtils = {
  getItem: (key: string) => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },
  addStorageListener: (key: string, callback: StorageListener) => {
    if (typeof window === "undefined") return () => {};

    const handler = (event: StorageEvent) => {
      if (event.key === key) {
        callback(event.newValue);
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  },
};
