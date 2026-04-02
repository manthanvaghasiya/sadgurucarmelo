import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const seedAdmin = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) process.exit(1);

        await mongoose.connect(mongoUri);

        // Delete any corrupt previously seeded admins without an employeeId
        await User.deleteMany({ role: 'admin' });

        // The auth route checks `employeeId` strictly.
        // We will map their requested 'admin@gmail.com' to `employeeId`.
        const masterAdmin = new User({
            name: 'Master Admin',
            employeeId: 'admin@gmail.com',
            email: 'admin@gmail.com',
            password: 'Sadguru@123', // Model pre-save hook handles bcrypt automatically now
            role: 'admin',
        });

        await masterAdmin.save();
        console.log('✅ Admin successfully created! You may now log in with -> Username: admin@gmail.com');
        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal Error creating admin user:', error);
        process.exit(1);
    }
};

seedAdmin();