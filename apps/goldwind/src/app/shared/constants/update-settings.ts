export interface UpdateSettings {
  edmhistorgram: {
    refresh: number;
  };
  shaft: {
    refresh: number;
  };
  grease: {
    refresh: number;
  };
  bearingLoad: {
    refresh: number;
  };
  staticSafety: {
    refresh: number;
  };
}

export const UPDATE_SETTINGS: UpdateSettings = {
  shaft: {
    refresh: 60,
  },
  grease: {
    refresh: 60,
  },
  bearingLoad: {
    refresh: 60,
  },
  staticSafety: {
    refresh: 60,
  },
  edmhistorgram: {
    refresh: 3600,
  },
};
