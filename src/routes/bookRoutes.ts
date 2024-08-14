import { Router } from 'express';
import { createBook, getAllBooks, getBookById, updateBook, deleteBook } from '../controllers/bookController';

const router: Router = Router();

router.post('/books', createBook);
router.get('/books', getAllBooks);
router.get('/books/:id', getBookById);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

export default router;
