import Settings from "../../models/Settings.js";

// GET current settings
export const getSettings = async (_req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// PUT update settings
export const updateSettings = async (req, res) => {
  try {
    const {
      maintenanceMode,
      emailNotifications,
      passwordPolicy,
      twoFactorAuth,
      sessionTimeout,
    } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body); // create if not exist
    } else {
      settings.maintenanceMode =
        maintenanceMode !== undefined
          ? maintenanceMode
          : settings.maintenanceMode;
      settings.emailNotifications =
        emailNotifications !== undefined
          ? emailNotifications
          : settings.emailNotifications;
      settings.passwordPolicy = passwordPolicy || settings.passwordPolicy;
      settings.twoFactorAuth =
        twoFactorAuth !== undefined ? twoFactorAuth : settings.twoFactorAuth;
      settings.sessionTimeout =
        sessionTimeout !== undefined ? sessionTimeout : settings.sessionTimeout;
    }

    const savedSettings = await settings.save();
    res.json(savedSettings);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
