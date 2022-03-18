import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import config from "../config/config";

const storage = new GridFsStorage({
    url: config.mongo.url,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-any-name-${file.originalname}`;
            return filename;
        }

        return {
            bucketName: "photos",
            filename: `${Date.now()}-any-name-${file.originalname}`,
        };
    },
});

const upload = multer({ storage });

export default upload;