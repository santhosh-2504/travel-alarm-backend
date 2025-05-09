// controllers/alarmController.js
import Alarm from '../models/Alarm.js';

// Generate a unique 8-digit security code
const generateSecurityCode = async () => {
  let isUnique = false;
  let securityCode;

  while (!isUnique) {
    // Generate random 8-digit number
    securityCode = Math.floor(10000000 + Math.random() * 90000000).toString();
    
    // Check if code exists in database
    const existingCode = await Alarm.findOne({ securityCode });
    if (!existingCode) {
      isUnique = true;
    }
  }

  return securityCode;
};

// Create a new alarm
export const createAlarm = async (req, res) => {
  try {
    const { 
      destination,
      userLocation, 
      distanceThreshold,
      securityCode
    } = req.body;

    // Validate required fields
    if (!destination || !destination.latitude || !destination.longitude) {
      return res.status(400).json({ 
        success: false, 
        message: 'Destination coordinates are required' 
      });
    }

    if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
      return res.status(400).json({ 
        success: false, 
        message: 'User location coordinates are required' 
      });
    }

    if (!distanceThreshold || ![1, 3, 5, 10].includes(Number(distanceThreshold))) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid distance threshold is required (1, 3, 5, or 10 km)' 
      });
    }
    
    // Create a new alarm
    const newAlarm = new Alarm({
      securityCode,
      destination,
      userLocation,
      distanceThreshold: Number(distanceThreshold)
    });

    await newAlarm.save();

    res.status(201).json({
      success: true,
      data: {
        securityCode,
        destination,
        distanceThreshold
      },
      message: 'Alarm created successfully'
    });
  } catch (error) {
    console.error('Error creating alarm:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating alarm',
      error: error.message
    });
  }
};

// Get alarm by security code
export const getAlarmByCode = async (req, res) => {
  try {
    const { code } = req.params;

    // Validate code format
    if (!code || !/^\d{8}$/.test(code)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid security code format. Must be 8 digits.'
      });
    }

    const alarm = await Alarm.findOne({ securityCode: code });

    if (!alarm) {
      return res.status(404).json({
        success: false,
        message: 'No alarm found with this security code'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        destination: alarm.destination,
        userLocation: alarm.userLocation,
        distanceThreshold: alarm.distanceThreshold,
        isActive: alarm.isActive,
        createdAt: alarm.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching alarm:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching alarm',
      error: error.message
    });
  }
};

// Update alarm status
export const updateAlarmStatus = async (req, res) => {
  try {
    const { code } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: 'isActive status is required'
      });
    }

    const alarm = await Alarm.findOne({ securityCode: code });

    if (!alarm) {
      return res.status(404).json({
        success: false,
        message: 'No alarm found with this security code'
      });
    }

    alarm.isActive = isActive;
    await alarm.save();

    res.status(200).json({
      success: true,
      message: `Alarm ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        isActive: alarm.isActive
      }
    });
  } catch (error) {
    console.error('Error updating alarm status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating alarm status',
      error: error.message
    });
  }
};

// Delete alarm
export const deleteAlarm = async (req, res) => {
  try {
    const { code } = req.params;

    const result = await Alarm.deleteOne({ securityCode: code });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'No alarm found with this security code'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Alarm deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting alarm:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting alarm',
      error: error.message
    });
  }
};