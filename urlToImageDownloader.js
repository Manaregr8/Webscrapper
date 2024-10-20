const fs = require('fs');
const path = require('path');
const axios = require('axios');
const csv = require('csv-parser');

// Directory to save images
const imageDir = './images';

// Ensure the directory exists
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
}

// Function to download an image from a URL and save it
async function downloadImage(url, imageName) {
    try {
        const response = await axios({
            url,
            responseType: 'stream'
        });

        // Save the image to the images directory
        const imagePath = path.resolve(imageDir, imageName);
        const writer = fs.createWriteStream(imagePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Error downloading image from ${url}:`, error.message);
    }
}

// Read the CSV file from the same directory
fs.createReadStream('./allDataYes.csv')
    .pipe(csv())
    .on('data', (row) => {
        const imageUrl = row.imageUrl;
        if (imageUrl) {
            // Generate a unique name for the image based on the productId or timestamp
            const imageName = `${row.productId || Date.now()}.jpg`;

            // Download the image
            downloadImage(imageUrl, imageName).then(() => {
                console.log(`Downloaded image: ${imageName}`);
            });
        }
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });
