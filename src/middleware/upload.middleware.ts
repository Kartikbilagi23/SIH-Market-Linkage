import multer from "multer";

const storage = multer.memoryStorage();

export const uploadCertificate = multer({
    storage,

    limits: {
        fileSize: 10 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return cb(
                new Error(
                    "Only PDF, JPEG and PNG files are allowed"
                )
            );
        }

        cb(null, true);
    },
});