import request from "supertest";
import app from '../src/app';
import Book from '../src/models/book';
import mongoose from 'mongoose';

let _id: string;

//Post Book test
describe('Post Book API', () => {
    it('should create a book', async () => {
        const res = await request(app)
            .post('/api/books')
            .send({
                title: 'Brave New World',
                author: 'Aldous Huxley',
                publishedYear: 1932,
                genres: ['Dystopian', 'Science Fiction'],
                stock: 9,
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toEqual(expect.objectContaining({
            title: 'Brave New World',
            author: 'Aldous Huxley',
            publishedYear: 1932,
            genres: ['Dystopian', 'Science Fiction'],
            stock: 9,
        }));
        _id = res.body._id;
    });

    it('should fail to create a book with missing required fields', async () => {
        const res = await request(app)
            .post('/api/books')
            .send({
                publishedYear: 1932,
                genres: ['Dystopian', 'Science Fiction'],
                stock: 9,
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message');
    });

    it('should fail to create a book with invalid data', async () => {
        const res = await request(app)
            .post('/api/books')
            .send({
                title: 'Invalid Book',
                author: 'Author Name',
                publishedYear: 'Invalid Year',
                genres: 'Not an Array',
                stock: 'Nine',
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message');
    });

});

//Find All Book test
describe('Find All Book API', () => {
    it('should retrieve all books with pagination', async () => {
        const res = await request(app)
            .get('/api/books')
            .query({ page: 1, limit: 10 })  // Pagination query
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toHaveProperty('page', 1);
        expect(res.body).toHaveProperty('totalPages', expect.any(Number));
        expect(res.body).toHaveProperty('totalBooks', expect.any(Number));
        expect(res.body).toHaveProperty('books');
        expect(res.body.books).toBeInstanceOf(Array);
        expect(res.body.books.length).toBeLessThanOrEqual(10);

        if (res.body.books.length > 0) {
            expect(res.body.books).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: expect.any(String),
                    title: expect.any(String),
                    author: expect.any(String),
                    publishedYear: expect.any(Number),
                    genres: expect.any(Array),
                    stock: expect.any(Number),
                }),
            ]));
        }
    });

    beforeEach(() => {
        jest.restoreAllMocks();
    });


    it('should handle errors when retrieving books', async () => {

        jest.spyOn(Book, 'find').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const res = await request(app)
            .get('/api/books')
            .expect('Content-Type', /json/)
            .expect(400);

        expect(res.body).toHaveProperty('message', 'Database error');
    });

    it('should retrieve books based on search query', async () => {
        const res = await request(app)
            .get('/api/books')
            .query({ search: 'keyword', page: 1, limit: 10 })
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toHaveProperty('page', 1);
        expect(res.body).toHaveProperty('totalPages', expect.any(Number));
        expect(res.body).toHaveProperty('totalBooks', expect.any(Number));
        expect(res.body).toHaveProperty('books');
        expect(res.body.books).toBeInstanceOf(Array);

        if (res.body.books.length > 0) {
            expect(res.body.books).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    _id: expect.any(String),
                    title: expect.any(String),
                    author: expect.any(String),
                    publishedYear: expect.any(Number),
                    genres: expect.any(Array),
                    stock: expect.any(Number),
                }),
            ]));
        }
    });
});

//Find Book By _ID
describe('Find Book By Id API', () => {
    it('should retrieve a book by its ID', async () => {
        const res = await request(app)
            .get(`/api/books/${_id}`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toEqual(expect.objectContaining({
            _id: _id,
            title: 'Brave New World',
            author: 'Aldous Huxley',
            publishedYear: 1932,
            genres: ['Dystopian', 'Science Fiction'],
            stock: 9,
        }));
    });

    it('should return an error message when the book is not found', async () => {
        const invalidBookId = '000000000000000000000000';

        const res = await request(app)
            .get(`/api/books/${invalidBookId}`)
            .expect('Content-Type', /json/)
            .expect(404);

        expect(res.body).toHaveProperty('message', 'Book not found');
    });
})

//Updating Book
describe('Updating Book API', () => {
    it('should update a book by its ID', async () => {

        const res = await request(app)
            .put(`/api/books/${_id}`)
            .send({
                genres: ['Dystopian', 'Science Fiction', 'Comic'],
            })
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toEqual(expect.objectContaining({
            _id: _id,
            title: 'Brave New World',
            author: 'Aldous Huxley',
            publishedYear: 1932,
            genres: ['Dystopian', 'Science Fiction', 'Comic'],
            stock: 9,
        }));
    });

    it('should return an error message when updating a non-existent book', async () => {
        const invalidBookId = '000000000000000000000000';

        const res = await request(app)
            .put(`/api/books/${invalidBookId}`)
            .send({
                genres: ['Comic'],
            })
            .expect('Content-Type', /json/)
            .expect(404);

        expect(res.body).toHaveProperty('message', 'Book not found');
    });
});

//Deleting Book
describe('Deleting Book API', () => {
    it('should delete a book by its ID', async () => {
        const res = await request(app)
            .delete(`/api/books/${_id}`)
            .expect('Content-Type', /json/)
            .expect(200);
        expect(res.body).toHaveProperty('message', 'Book deleted successfully');
    });

    it('should return an error message when deleting a non-existent book', async () => {
        const res = await request(app)
            .delete(`/api/books/${_id}`)
            .expect('Content-Type', /json/)
        expect(res.body).toHaveProperty('message', 'Book not found');
    });
});


afterAll(async () => {
    await mongoose.disconnect(); // Disconnect from the database
});