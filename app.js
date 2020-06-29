// * Third Party Libraries
const express = require('express');

// * Initiallizations
const app = express();
const port = 3000;


app.listen(port, () => console.log(`Server listening on port ${port}`));