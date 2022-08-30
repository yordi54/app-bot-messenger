const app = require('./app');
const port = app.get('port');






app.listen(port, () => {
    console.log(`running in the port: ${port}`);
});

