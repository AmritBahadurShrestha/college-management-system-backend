import fs from 'fs';
import cloudinary from '../config/cloudinary.config';
import CustomError from '../middlewares/error-handler.middleware';

export const uploadFile = async(path: string, dir = '/') => {
    try {
        const { public_id, secure_url } = await cloudinary.uploader.upload(path, {
            unique_filename: true,
            folder: 'college-management-system' + dir,
        });

        // Delete Image From Uploads
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }

        return {
            public_id,
            path: secure_url,
        };
    } catch (error) {
        throw new CustomError('File upload error', 500);
    }
};

export const deleteFiles = async(public_ids: string[]) => {
    try {
        const promiseRes = public_ids.map(async(public_id) => {
            return await cloudinary.uploader.destroy(public_id);
    });
    const res = await Promise.all(promiseRes);

    return true;
    } catch (error) {
        throw new CustomError('File delete error', 500);
    }
};
