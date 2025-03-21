const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); // For generating ETag

const PORT = 3000;
const IMAGE_FOLDER = path.join(__dirname, 'images');
const IMAGE_NOT_FOUND = path.join(IMAGE_FOLDER, 'image-not-found.jpg'); // Path to the default image

// In-memory cache
const cache = new Map();

const server = http.createServer((req, res) => {
    // Construct the file path
    const filePath = path.join(IMAGE_FOLDER, req.url);

    // Prevent directory traversal attacks
    if (!filePath.startsWith(IMAGE_FOLDER)) {
        res.statusCode = 403;
        res.end('Forbidden');
        return;
    }

    // Check if the file is in cache
    if (cache.has(filePath)) {
        const { data, mimeType, etag } = cache.get(filePath);
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
        res.setHeader('ETag', etag);

        // Handle conditional requests
        if (req.headers['if-none-match'] === etag) {
            res.statusCode = 304;
            res.end();
        } else {
            res.statusCode = 200;
            res.end(data);
        }
        return;
    }

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // If the file doesn't exist, serve the default "image-not-found.jpg"
            fs.readFile(IMAGE_NOT_FOUND, (err, data) => {
                if (err) {
                    res.statusCode = 404;
                    res.end('Image not found, and default image is missing');
                } else {
                    const etag = crypto.createHash('md5').update(data).digest('hex');
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'image/jpeg');
                    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
                    res.setHeader('ETag', etag);
                    res.end(data);
                }
            });
            return;
        }

        // Read and serve the file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('Error reading file');
            } else {
                // Set the appropriate Content-Type based on file extension
                const ext = path.extname(filePath).toLowerCase();
                const mimeTypes = {
                    '.jpg': 'image/jpeg',
                    '.jpeg': 'image/jpeg',
                    '.png': 'image/png',
                    '.gif': 'image/gif',
                    '.webp': 'image/webp',
                };
                const mimeType = mimeTypes[ext] || 'application/octet-stream';
                const etag = crypto.createHash('md5').update(data).digest('hex');

                // Cache the file in memory
                cache.set(filePath, { data, mimeType, etag });

                res.setHeader('Content-Type', mimeType);
                res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
                res.setHeader('ETag', etag);

                // Handle conditional requests
                if (req.headers['if-none-match'] === etag) {
                    res.statusCode = 304;
                    res.end();
                } else {
                    res.statusCode = 200;
                    res.end(data);
                }
            }
        });
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});