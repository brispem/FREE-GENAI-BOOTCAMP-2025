const express = require('express');
const app = express();
const port = 8008;

// Serve static files from the public directory
app.use(express.static('public'));

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 