import express from 'express';

const app = express();

// Serve the public directory
app.use(express.static('public'));

// Serve the src directory
app.use('/src', express.static('src'));

app.listen(3000);
