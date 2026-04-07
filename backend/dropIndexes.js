import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const dropObsoleteIndex = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('❌ MONGO_URI not found in environment');
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        // console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('users');

        // Drop the index 'employeeId_1' which is causing the E11000 null duplicate error
        try {
            await collection.dropIndex('employeeId_1');
            console.log('✅ Successfully dropped index: employeeId_1');
        } catch (err) {
            if (err.codeName === 'IndexNotFound' || (err.message && err.message.includes('IndexNotFound'))) {
                console.log('ℹ️ Index employeeId_1 already dropped or does not exist.');
            } else {
                throw err;
            }
        }

        console.log('🚀 Database migration complete. You can now create new staff accounts.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration Error:', error);
        process.exit(1);
    }
};

dropObsoleteIndex();
