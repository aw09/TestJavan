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



// API
app.get('/people', async (req, res) => {
    const result = await server.getPeople()
    res.json(result);
});

app.post('/people/:id', (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const gender = req.body.gender;
    const parent = req.body.parent;
    console.log(req);
    const result = server.updatePerson(id, name, gender, parent)
    if(result){
        res.json({ message: 'Person updated successfully' });
    }
});



// VIEW
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


app.get('/:personId/edit', async (req, res) => {
    const personId = req.params.personId;
    const person = await server.getPerson(personId)
    const people = await server.getPeople()
    res.render(path.join(__dirname, '/views/person', 'edit.html'), { person: person, people: people });
});





app.listen(3000, () => {
    console.log('Server listening on port 3000');
});