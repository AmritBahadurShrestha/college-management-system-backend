import express from 'express';
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} from '../controllers/user.controller';
import { allAST } from '../types/global.types';
import { authenticate } from '../middlewares/auth.middleware';


const router = express.Router();

router.get('/', authenticate(allAST), getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', authenticate(allAST), updateUser);
router.delete('/:id', authenticate(allAST), deleteUser);

export default router;
