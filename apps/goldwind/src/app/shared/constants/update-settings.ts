export interface UpdateSettings {
  shaft: {
    refresh: number;
  };
  grease: {
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
};
