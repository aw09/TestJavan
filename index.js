const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const path = require('path');
const server = require('./server');

const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');


const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});



app.get('/people', async (req, res) => {
    const result = await server.getPeople()
    res.json(result);
});


app.delete('/people/:personId/assets/:assetId', (req, res) => {
    const personId = req.params.personId;
    const assetId = req.params.assetId;
    const sql = `DELETE FROM Asset WHERE person_id = ? AND id = ?`;
    db.run(sql, [personId, assetId], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Asset deleted successfully' });
    });
});

app.get('/', async (req, res) => {
    const people = await server.getPeople()
    res.render(path.join(__dirname, '/views', 'index.html'), { people: people });
});

app.get('/:personId', async (req, res) => {
    const personId = req.params.personId;
    const person = await server.getPerson(personId)
    const assets = await server.getAssets(personId)
    res.render(path.join(__dirname, '/views', 'asset.html'), { person: person, assets: assets });
});





app.listen(3000, () => {
    console.log('Server listening on port 3000');
});