import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { Request } from 'express';
import CustomError from './error-handler.middleware';

export const uploader = () => {
    const fileSize = 5 * 1024 * 1024;

    const allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'avif'];

    const myStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = 'uploads/';

            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueName = Date.now() + '-' + file.originalname;
            cb(null, uniqueName);
        }
    });

    const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {

        const ext = path.extname(file.originalname).replace('.', '');

        if (allowedExts.includes(ext)) {
            cb(null, true);
        } else {
            const err = new CustomError(`File format ${ext} is not allowed`, 400);
            cb(err);
        }
    };

    const upload = multer({
        storage: myStorage,
        limits: { fileSize },
        fileFilter
    });

    return upload;
};
