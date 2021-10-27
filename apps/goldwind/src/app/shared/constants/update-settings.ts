export interface UpdateSettings {
  loaddistribution: {
    refresh: number;
  };
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
  loaddistribution: {
    refresh: 60,
  },
  shaft: {
    refresh: 60,
  },
  grease: {
    refresh: 15 * 60,
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
