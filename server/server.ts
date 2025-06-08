import express from 'express';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';



const app = express();
const PORT = 4000;

const swaggerSpec = swaggerJsDoc({
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'REST API with TypeScript + Express',
            version: '1.0.0',
            description: 'Dokumentacja API',
        },
        servers: [
            {
                url: 'http://localhost:4000',
            },
        ],
    },
    apis: ['./server.ts'], // 👈 tutaj możesz też dać inne pliki z endpointami
});



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded())
app.use(bodyParser.urlencoded({
    extended: true
}));



app.use((req, res, next) => {

    const originalJson = res.json;
    res.json = function (body: any) {
        res.setHeader('x-custom-header', 'RSI-TS-Test');

        // Jeśli Location NIE JEST ustawione, możesz np. ustawić domyślny (opcjonalnie)
        if (!res.getHeader('Location') && req.method === 'POST' && body?.id) {
            const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}/${body.id}`;
            res.setHeader('Location', fullUrl);
        }

        return originalJson.call(this, body);
    };
    next();

});

//autoryzacja
app.use((req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.setHeader('WWW-Authenticate', 'Basic');
        res.status(401).json({ error: 'Brak autoryzacji' });
        return;
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    if (username === 'admin' && password === '123') {
        next();
    } else {
        res.setHeader('WWW-Authenticate', 'Basic');
        res.status(401).json({ error: 'Nieprawidłowy login lub hasło' });
    }
});



// Middleware do filtrowania odpowiedzi
app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function (body: any) {
        // Przykładowy filtr: ukryj cenę produktu, jeśli w query jest hidePrice=true
        if (req.query.hidePrice === 'true') {
            if (Array.isArray(body)) {
                body = body.map(item => {
                    const { price, ...rest } = item;
                    return rest;
                });
            } else if (body && typeof body === 'object') {
                const { price, ...rest } = body;
                body = rest;
            }
        }

        return originalJson.call(this, body);
    };
    next();
});




type Product = { id: number, name: string, price: number };

type Comment = {
    id: number;
    message: string;
};

const commentsMap: Record<number, Comment[]> = {
    1: [{ id: 1, message: 'Bardzo fajny produkt!' }]
};
// const users: { id: number; name: string }[] = [];
const products: Product[] = [
    {id: 1, name: "Laptop", price: 2000},
    {id: 2, name: "GPU", price: 1500},
    {id: 3, name: "CPU", price: 500},
    {id: 4, name: "Motherboard", price: 200},
    {id: 5, name: "Power Supply", price: 300},
];

const createProductLinks = (productId: number) => ({
    self: { href: `http://localhost:${PORT}/api/products/${productId}` },
    comments: { href: `http://localhost:${PORT}/api/products/${productId}/comments` }
});

const createUserLinks = (userId: number) => ({
    self: { href: `http://localhost:${PORT}/api/users/${userId}` },
    update: { href: `http://localhost:${PORT}/api/users/${userId}` },
    delete: { href: `http://localhost:${PORT}/api/users/${userId}` }
});

const createCommentLinks = (productId: number, commentId: number) => ({
    self: { href: `http://localhost:${PORT}/api/products/${productId}/comments/${commentId}` }
});


const  users = [
    { id: 1, name: 'Jan' },
    { id: 2, name: 'Anna' }
];

// type ProductSearch = {
//     name?: string;
//     minPrice?: number;
// };

app.get('/api/products/:id/comments', (req, res) => {
    const productId = parseInt(req.params.id);
    const comments = commentsMap[productId] || [];
    res.json(comments);
});

app.post('/api/products/:id/comments', (req, res) => {
    const productId = parseInt(req.params.id);
    const { message } = req.body;
    const newComment: Comment = {
        id: Date.now(),
        message
    };
    if (!commentsMap[productId]) commentsMap[productId] = [];
    commentsMap[productId].push(newComment);
    res.status(201).json(newComment);
});


app.post('/api/products/search', (req, res) => {
    const { name, minPrice } = req.body;
    const results = products.filter(p =>
        (!name || p.name.includes(name)) &&
        (!minPrice || p.price >= minPrice)
    );
    res.json(results);
});

app.get('/api/products/search', (req, res) => {
    const { name, minPrice } = req.query;

    // Parsujemy minPrice do liczby (bo query param to string!)
    const min = minPrice ? parseFloat(minPrice as string) : undefined;

    // Filtrowanie
    let filtered = products;

    if (name) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes((name as string).toLowerCase())
        );
    }

    if (!isNaN(min as number)) {
        filtered = filtered.filter(p => p.price >= (min as number));
    }

    res.json(filtered);
});




app.get('/api/products', (req, res) => {
    const result = products.map(p => ({
        ...p,
        _links: createProductLinks(p.id)
    }));
    res.json(result);
});

// app.get('/api/users', (req, res) => {
//     res.json(users);
// });
//
// app.get('/api/users/:id', (req, res) => {
//     const id = parseInt(req.params.id);
//     const user = users.find(u => u.id === id);
//     if (user) res.json(user);
//     else res.status(404).json({ error: 'Not found' });
// });

app.get('/api/users', (req, res) => {
    const result = users.map(u => ({
        ...u,
        _links: createUserLinks(u.id)
    }));
    res.json(result);
});

app.get('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
    if (user) {
        res.json({
            ...user,
            _links: createUserLinks(user.id)
        });
    } else {
        res.status(404).json({ error: 'Not found' });
    }
});


app.post('/api/products/:id/comments', (req, res) => {
    const productId = parseInt(req.params.id);
    const { message } = req.body;

    const newComment: Comment = {
        id: Date.now(),
        message
    };

    if (!commentsMap[productId]) commentsMap[productId] = [];
    commentsMap[productId].push(newComment);

    const location = `http://localhost:${PORT}/api/products/${productId}/comments/${newComment.id}`;
    res.setHeader('Location', location);
    console.log('Location set to:', location);

    res.status(201).json(newComment);
});
app.post('/api/products/:id/comments', (req, res) => {
    const productId = parseInt(req.params.id);
    const { message } = req.body;

    const newComment: Comment = {
        id: Date.now(),
        message
    };

    if (!commentsMap[productId]) commentsMap[productId] = [];
    commentsMap[productId].push(newComment);

    const location = `http://localhost:${PORT}/api/products/${productId}/comments/${newComment.id}`;
    res.setHeader('Location', location);
    console.log('Location set to:', location);

    res.status(201).json({
        ...newComment,
        _links: createCommentLinks(productId, newComment.id)
    });
});




app.put('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    const user = users.find(u => u.id === id);
    if (user) {
        user.name = name;
        res.json(user);
    } else {
        res.status(404).json({ error: 'Not found' });
    }
});

app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
        const deleted = users.splice(index, 1);
        res.json(deleted[0]);
    } else {
        res.status(404).json({ error: 'Not found' });
    }
});

app.listen(PORT, () => {
    console.log(`REST API listening on http://localhost:${PORT}`);
});
