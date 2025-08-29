        const express = require('express');
        const app = express();
        const port = 3000;

        app.get('/', (req, res, next) => {
          res.send('API running');
        });

        app.listen(port, () => {
          console.log(`Server listening at http://localhost:${port}`);
        });