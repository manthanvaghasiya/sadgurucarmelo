import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Provide __dirname equivalent in ES modules to ensure `.env` resolves correctly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Define minimal user schema necessary for the seeder
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'salesman'] },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

const seedAdmin = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            console.error('❌ MONGO_URI is not defined in the environment variables!');
            process.exit(1);
        }

        console.log('Connecting to database...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB.');

        // Check if an admin already exists to prevent duplicate seeding
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('⚠️ Admin user already exists. Skipping operation.');
            process.exit(0);
        }

        console.log('Generating secured credentials...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Sadguru@123', salt);

        // Inject Master Admin payload
        const masterAdmin = new User({
            name: 'Master Admin',
            username: 'admin@gmail.com',
            password: hashedPassword,
            role: 'admin',
        });

        await masterAdmin.save();
        console.log('✅ Admin successfully created! You may now login via the frontend.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal Error creating admin user:', error);
        process.exit(1);
    }
};

seedAdmin();