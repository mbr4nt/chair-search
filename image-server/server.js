const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const IMAGE_FOLDER = path.join(__dirname, 'images');
const IMAGE_NOT_FOUND = path.join(IMAGE_FOLDER, 'image-not-found.jpg');

const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
};

function generateEtag(stats) {
    const mtime = stats.mtime.getTime().toString(16);
    const size = stats.size.toString(16);
    return `"${mtime}-${size}"`;
}

const server = http.createServer((req, res) => {
    const filePath = path.join(IMAGE_FOLDER, req.url);

    // Prevent directory traversal attacks
    if (!filePath.startsWith(IMAGE_FOLDER)) {
        res.statusCode = 403;
        res.end('Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err) {
            // File not found - serve default image
            fs.stat(IMAGE_NOT_FOUND, (err, defaultStats) => {
                if (err) {
                    res.statusCode = 404;
                    res.end('Image not found, and default image is missing');
                    return;
                }

                const etag = generateEtag(defaultStats);
                res.setHeader('ETag', etag);
                res.setHeader('Cache-Control', 'public, max-age=31536000');

                if (req.headers['if-none-match'] === etag) {
                    res.statusCode = 304;
                    res.end();
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'image/jpeg');
                    const stream = fs.createReadStream(IMAGE_NOT_FOUND);
                    stream.on('error', () => {
                        res.statusCode = 500;
                        res.end('Error serving default image');
                    });
                    stream.pipe(res);
                }
            });
        } else {
            // File exists - serve it
            const etag = generateEtag(stats);
            res.setHeader('ETag', etag);
            res.setHeader('Cache-Control', 'public, max-age=31536000');

            if (req.headers['if-none-match'] === etag) {
                res.statusCode = 304;
                res.end();
                return;
            }

            const ext = path.extname(filePath).toLowerCase();
            const mimeType = mimeTypes[ext] || 'application/octet-stream';
            res.setHeader('Content-Type', mimeType);

            const stream = fs.createReadStream(filePath);
            stream.on('error', () => {
                res.statusCode = 500;
                res.end('Error reading file');
            });
            stream.pipe(res);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});