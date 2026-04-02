const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Assuming your model is at backend/models/User.js
const User = require('./models/User');

const createFirstAdmin = async () => {
    try {
        // 1. Connect to your database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        // 2. Check if admin already exists so we don't make duplicates
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('⚠️ Admin already exists in the database!');
            process.exit();
        }

        // 3. Encrypt the password (NEVER save plain text passwords)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Sadguru@123', salt);

        // 4. Create the Admin User object
        const adminUser = new User({
            name: 'Super Admin',
            username: 'admin',
            email: 'admin@sadgurucarmelo.com',
            password: hashedPassword,
            role: 'admin'
        });

        // 5. Save to MongoDB
        await adminUser.save();
        console.log('✅ SUCCESS: Master Admin Created!');
        console.log('👉 Username: admin');
        console.log('👉 Password: Sadguru@123');

        process.exit();
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    }
};

createFirstAdmin();