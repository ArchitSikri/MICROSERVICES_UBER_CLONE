const http = require('http');
const app = require('./app');
const connectToDb = require('./db/db');

async function startServer() {
    try {
        await connectToDb();

        const server = http.createServer(app);
        const port = process.env.PORT || 3002;
        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error.message);
        process.exit(1);
    }
}

startServer();