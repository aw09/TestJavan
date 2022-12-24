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


// API
app.get('/people', async (req, res) => {
    const result = await server.getPeople()
    res.json(result);
});

app.post('/people', (req, res) => {
    const name = req.body.name;
    const gender = req.body.gender;
    const parent = req.body.parent;
    const result = server.createPerson(name, gender, parent)
    if(result){
        res.json({ message: 'New Person Inserted' });
    }
});

app.post('/people/:id', (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const gender = req.body.gender;
    const parent = req.body.parent;
    const result = server.updatePerson(id, name, gender, parent)
    if(result){
        res.json({ message: 'Person updated successfully' });
    }
});

app.get('/people/:id/delete', (req, res) => {
    const id = req.params.id;
    const result = server.deletePerson(id)
    if(result){
        res.json({ message: 'Person deleted successfully' });
    }
});

app.post('/asset/new', async (req, res) => {
    const name = req.body.name;
    const personId = req.body.owner;
    const result = server.createAsset(name, personId)
    if(result){
        res.json({ message: 'New Asset Inserted' });
    }
});


app.post('/asset/:id', async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const personId = req.body.owner;
    const result = server.updateAsset(id, name, personId)
    if(result){
        res.json({ message: 'Asset updated successfully' });
    }
});

app.get('/asset/:id/delete', async (req, res) => {
    const id = req.params.id;
    const result = server.deleteAsset(id)
    if(result){
        res.json({ message: 'Asset deleted successfully' });
    }
});






// VIEW
app.get('/', async (req, res) => {
    const people = await server.getPeople()
    
    res.render(path.join(__dirname, '/views', 'index.html'), { people: people });
});

app.get('/new', async (req, res) => {
    const people = await server.getPeople()
    
    res.render(path.join(__dirname, '/views/person', 'new.html'), { people: people });
});

app.get('/:personId', async (req, res) => {
    const personId = req.params.personId;
    const person = await server.getPerson(personId)
    const assets = await server.getAssets(personId)
    res.render(path.join(__dirname, '/views', 'detail.html'), { person: person, assets: assets });
});


app.get('/:personId/edit', async (req, res) => {
    const personId = req.params.personId;
    const person = await server.getPerson(personId)
    const people = await server.getPeople()
    res.render(path.join(__dirname, '/views/person', 'edit.html'), { person: person, people: people });
});

app.get('/asset/new', async (req, res) => {
    const people = await server.getPeople()
    res.render(path.join(__dirname, '/views/asset', 'new.html'), { people: people });
});

app.get('/asset/:assetId/edit', async (req, res) => {
    const assetId = req.params.assetId;
    const asset = await server.getAsset(assetId)
    const people = await server.getPeople()
    res.render(path.join(__dirname, '/views/asset', 'edit.html'), { asset: asset, people: people });
});





app.listen(3000, () => {
    console.log('Server listening on port 3000');
});