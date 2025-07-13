import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { User as IUser, UserProfile, UserStats, StreakData } from '../../../shared/types';

interface UserDocument extends Omit<IUser, '_id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  updateStreak(): void;
}

const userProfileSchema = new Schema<UserProfile>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatar: { type: String },
  grade: { type: String },
  subjects: [{ type: String }],
  targetTests: [{ type: String }]
});

const userStatsSchema = new Schema<UserStats>({
  totalQuestions: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  averageTime: { type: Number, default: 0 },
  weakAreas: [{ type: String }],
  strongAreas: [{ type: String }],
  totalStudyTime: { type: Number, default: 0 }
});

const streakDataSchema = new Schema<StreakData>({
  current: { type: Number, default: 0 },
  longest: { type: Number, default: 0 },
  lastActivity: { type: Date, default: Date.now }
});

const userSchema = new Schema<UserDocument>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    type: userProfileSchema,
    required: true
  },
  stats: {
    type: userStatsSchema,
    default: () => ({})
  },
  streaks: {
    type: streakDataSchema,
    default: () => ({})
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update streak method
userSchema.methods.updateStreak = function(): void {
  const now = new Date();
  const lastActivity = new Date(this.streaks.lastActivity);
  const daysDiff = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 1) {
    // Consecutive day
    this.streaks.current += 1;
    if (this.streaks.current > this.streaks.longest) {
      this.streaks.longest = this.streaks.current;
    }
  } else if (daysDiff > 1) {
    // Streak broken
    this.streaks.current = 1;
  }
  // If daysDiff === 0, same day, no change needed
  
  this.streaks.lastActivity = now;
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export default mongoose.model<UserDocument>('User', userSchema);
