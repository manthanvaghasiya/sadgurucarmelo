import mongoose from 'mongoose';
import dns from 'dns';

// Force Google/Cloudflare Public DNS for MongoDB Atlas SRV resolution
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore in environments where custom DNS is restricted
}

let isConnecting = false;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    while (mongoose.connection.readyState === 2) {
      await new Promise((r) => setTimeout(r, 50));
    }
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }
  }

  try {
    isConnecting = true;
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  } finally {
    isConnecting = false;
  }
};

export default connectDB;

