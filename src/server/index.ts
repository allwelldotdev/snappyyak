import { Hono } from 'hono';
import { sign, verify } from 'hono/jwt';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';
import { hash, compare } from 'bcryptjs';

const app = new Hono().basePath('/api');
const JWT_SECRET = 'your-secret-key-change-this';

app.post('/auth/signup', async (c) => {
    const { email, password } = await c.req.json();

    if (!email || !password) {
        return c.json({ error: 'Email and password are required' }, 400);
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email)).get();
    if (existingUser) {
        return c.json({ error: 'User already exists' }, 409);
    }

    const hashedPassword = await hash(password, 10);

    try {
        const result = await db.insert(users).values({
            email,
            password: hashedPassword,
        }).returning().get();

        const token = await sign({ id: result.id, email: result.email }, JWT_SECRET);

        return c.json({ token, user: { id: result.id, email: result.email } }, 201);
    } catch (error: any) {
        console.error('Signup error:', error);
        return c.json({ error: error.message || 'Unknown error', stack: error.stack }, 500);
    }
});

app.post('/auth/login', async (c) => {
    const { email, password } = await c.req.json();

    if (!email || !password) {
        return c.json({ error: 'Email and password are required' }, 400);
    }

    const user = await db.select().from(users).where(eq(users.email, email)).get();
    if (!user) {
        return c.json({ error: 'Invalid credentials' }, 401);
    }

    const validPassword = await compare(password, user.password);
    if (!validPassword) {
        return c.json({ error: 'Invalid credentials' }, 401);
    }

    const token = await sign({ id: user.id, email: user.email }, JWT_SECRET);
    return c.json({ token, user: { id: user.id, email: user.email } });
});

app.get('/auth/me', async (c) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = await verify(token, JWT_SECRET, 'HS256');
        return c.json({ user: payload });
    } catch (err) {
        return c.json({ error: 'Invalid token' }, 401);
    }
});

export default app;
