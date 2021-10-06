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
    refresh: 10,
  },
  grease: {
    refresh: 10,
  },
  bearingLoad: {
    refresh: 10,
  },
  staticSafety: {
    refresh: 60,
  },
  edmhistorgram: {
    refresh: 3600,
  },
};
