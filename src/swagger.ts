import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Library Management API',
            version: '1.0.0',
            description: 'API Documentation for the Library Management System',
        },
        components: {
            schemas: {
                Book: {
                    type: 'object',
                    required: ['title', 'author'],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'The auto-generated id of the book',
                        },
                        title: {
                            type: 'string',
                            description: 'The title of the book',
                        },
                        author: {
                            type: 'string',
                            description: 'The author of the book',
                        },
                        publishedDate: {
                            type: 'string',
                            description: 'The date the book was published',
                        },
                    },
                },
            },
        },
        servers: [
            {
                url: 'http://localhost:9100/api',
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
export default swaggerDocs;