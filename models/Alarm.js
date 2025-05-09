// models/Alarm.js
import mongoose from 'mongoose';

const alarmSchema = new mongoose.Schema({
  securityCode: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d{8}$/.test(v); // Validate 8-digit code
      },
      message: props => `${props.value} is not a valid 8-digit security code!`
    }
  },
  destination: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    name: {
      type: String
    }
  },
  userLocation: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  distanceThreshold: {
    type: Number,
    required: true,
    enum: [1, 3, 5, 10] // Only these values are allowed
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '48h' // Automatically delete records after 48 hours
  }
});

// Add indexes for performance
alarmSchema.index({ securityCode: 1 }, { unique: true });
alarmSchema.index({ createdAt: 1 }, { expireAfterSeconds: 172800 }); // 48 hours in seconds

const Alarm = mongoose.model('Alarm', alarmSchema);

export default Alarm;