import express from 'express';
import Car from '../models/Car.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Fetch all available cars, explicitly leaning the query for performance
        const cars = await Car.find({ status: 'Available' }).select('_id updatedAt').lean();
        
        // Ensure NO trailing slash in baseUrl
        const rawBaseUrl = process.env.FRONTEND_URL || 'https://sadgurucarmelo.com';
        const baseUrl = rawBaseUrl.split(',')[0].replace(/\/$/, '');
        
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        
        // Static URLs
        const staticPages = [
            { url: '/', priority: '1.0' },
            { url: '/inventory', priority: '0.9' },
            { url: '/about', priority: '0.8' },
            { url: '/contact', priority: '0.8' }
        ];

        for (const page of staticPages) {
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
            xml += `    <changefreq>daily</changefreq>\n`;
            xml += `    <priority>${page.priority}</priority>\n`;
            xml += `  </url>\n`;
        }

        // Dynamic Car URLs
        for (const car of cars) {
            // Using lastmod ensures Google knows when a specific car listing was updated
            const date = new Date(car.updatedAt || new Date()).toISOString();
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl}/car/${car._id}</loc>\n`;
            xml += `    <lastmod>${date}</lastmod>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>0.8</priority>\n`;
            xml += `  </url>\n`;
        }

        xml += `</urlset>`;

        res.header('Content-Type', 'application/xml');
        res.status(200).send(xml);

    } catch (error) {
        console.error('Sitemap generation error:', error);
        res.status(500).end();
    }
});

export default router;
