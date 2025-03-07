import multer from 'multer'

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Export the upload middleware for use in the routes
export const uploadFiles = upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'portfolio', maxCount: 1 },
]);