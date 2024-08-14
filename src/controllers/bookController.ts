import { Request, Response } from 'express';
import Book, { IBook } from '../models/book';

// Create a Book
export const createBook = async (req: Request, res: Response) => {
    try {
        const newBook: IBook = new Book(req.body);
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Get All Books
export const getAllBooks = async (req: Request, res: Response) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;

        const query: any = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
                { genres: { $regex: search, $options: 'i' } }
            ];
        }

        const books = await Book.find(query)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .lean();

        const totalBooks = await Book.countDocuments(query);
        const totalPages = Math.ceil(totalBooks / Number(limit));

        res.status(200).json({
            page: Number(page),
            totalPages,
            totalBooks,
            books,
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Get Book by ID
export const getBookById = async (req: Request, res: Response) => {
    try {
        const book = await Book.findById(req.params.id).lean();
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.status(200).json(book);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Update Book Information
export const updateBook = async (req: Request, res: Response) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
        if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
        res.status(200).json(updatedBook);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a Book
export const deleteBook = async (req: Request, res: Response) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id).lean();
        if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
