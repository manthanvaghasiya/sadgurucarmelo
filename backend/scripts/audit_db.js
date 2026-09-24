import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import Car from '../models/Car.js';

async function auditDB() {
  console.log('\n=============================================');
  console.log('🚀 SADGURU DB AUDIT: Verifying Image URLs');
  console.log('=============================================\n');

  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is missing from .env');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const cars = await Car.find({});
    console.log(`📊 Found ${cars.length} total cars in DB`);

    let totalImages = 0;
    let imagekitCount = 0;
    let r2Count = 0;
    let cloudinaryCount = 0;
    let otherCount = 0;
    let corruptedCars = [];

    cars.forEach(car => {
      let carHasErrors = false;
      
      if (!car.images || car.images.length === 0) {
        console.warn(`⚠️ Car [${car.make} ${car.model}] (ID: ${car._id}) has NO images!`);
        return;
      }

      car.images.forEach((img) => {
        totalImages++;
        const url = typeof img === 'object' && img?.url ? img.url : (typeof img === 'string' ? img : '');
        
        if (!url) {
          otherCount++;
          carHasErrors = true;
          return;
        }

        if (url.includes('ik.imagekit.io')) {
          imagekitCount++;
        } else if (url.includes('r2.dev') || url.includes('cloudflarestorage.com') || (process.env.R2_PUBLIC_DOMAIN && url.includes(process.env.R2_PUBLIC_DOMAIN))) {
          r2Count++;
        } else if (url.includes('cloudinary.com')) {
          cloudinaryCount++;
        } else {
          otherCount++;
        }
      });

      if (carHasErrors) {
        corruptedCars.push(car);
      }
    });

    console.log('\n--- 📈 AUDIT RESULTS ---');
    console.log(`📸 Total Images Scanned: ${totalImages}`);
    console.log(`🚀 ImageKit URLs: ${imagekitCount} (${totalImages > 0 ? ((imagekitCount/totalImages)*100).toFixed(1) : 0}%)`);
    console.log(`☁️ Cloudflare R2 URLs: ${r2Count} (${totalImages > 0 ? ((r2Count/totalImages)*100).toFixed(1) : 0}%)`);
    console.log(`📦 Cloudinary URLs: ${cloudinaryCount} (${totalImages > 0 ? ((cloudinaryCount/totalImages)*100).toFixed(1) : 0}%)`);
    console.log(`❓ Other/Placeholder URLs: ${otherCount} (${totalImages > 0 ? ((otherCount/totalImages)*100).toFixed(1) : 0}%)`);

    if (corruptedCars.length > 0) {
      console.log('\n⚠️ The following cars have broken image links:');
      corruptedCars.forEach(c => {
        console.log(`   - ${c.make} ${c.model} (${c._id})`);
      });
    } else {
      console.log('\n🎉 SUCCESS! All vehicle images are healthy.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Database Audit failed:', error.message);
    process.exit(1);
  }
}

auditDB();
