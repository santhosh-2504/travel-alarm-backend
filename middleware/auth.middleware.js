import Device from '../models/device.model.js';

export const verifyDevice = async (req, res, next) => {
  try {
    const deviceId = req.headers['x-device-id'];
    
    if (!deviceId) {
      return res.status(401).json({
        success: false,
        error: 'Device ID required in X-Device-ID header'
      });
    }

    const device = await Device.findOne({ deviceId });
    
    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not registered'
      });
    }

    req.device = device;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Device authentication failed'
    });
  }
};