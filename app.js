// * Third Party Libraries
const express = require('express');

// * Custom file imports

// * Initiallizations
const app = express();
const port = 3000;

// * Filtering Routes

// * General 404 error
app.use((req, res, next) => {
    res.status(404).json({
        errorCode: 404,
        message: "Sorry that route does not exist"
    });
});
app.listen(port, () => console.log(`Server listening on port ${port}`));