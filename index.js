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
app.use(express.static('public'));


// ================= API =================
app.get('/people', async (req, res) => {
    const result = await server.getPeople()
    res.json(result);
});

app.post('/people', async (req, res) => {
    const name = req.body.name;
    const gender = req.body.gender;
    const parent = req.body.parent;
    
    const result = await server.createPerson(name, gender, parent);
    const message = "New Person Inserted";
    if(result){
        res.redirect(`/?message=${message}`);
    }
});

app.post('/people/:id', async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const gender = req.body.gender;
    const parent = req.body.parent;
    
    const result = await server.updatePerson(id, name, gender, parent)
    const message = 'Person updated successfully'
    if(result){
        res.redirect(`/?message=${message}`);
    }
});

app.get('/people/:id/delete', async (req, res) => {
    const id = req.params.id;
    const result = await server.deletePerson(id)
    const message = 'Person deleted successfully'
    if(result){
        res.redirect(`/?message=${message}`);
    }
});

app.post('/asset/new', async (req, res) => {
    const name = req.body.name;
    const personId = req.body.owner;
    const person = await server.getPerson(personId);
    const result = await server.createAsset(name, personId);
    if(result){
        res.redirect(`/${person.id}?message=New Asset Inserted`);
    }
});


app.post('/asset/:id', async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const personId = req.body.owner;
    const person = await server.getPerson(personId);
    const result = await server.updateAsset(id, name, personId)
    if(result){
        res.redirect(`/${person.id}?message=Asset Updated successfully`);
    }
});

app.get('/asset/:id/delete', async (req, res) => {
    const id = req.params.id;
    const asset = await server.getAsset(id);
    const result = await server.deleteAsset(id)
    if(result){
        res.redirect(`/${asset.person_id}?message=Asset deleted successfully`);
    }
});




// ================= VIEW =================
app.get('/', async (req, res) => {
    const people = await server.getPeople()
    const message = req.query.message;
    
    res.render(path.join(__dirname, '/views', 'index.html'), { people: people, message: message });
});

app.get('/new', async (req, res) => {
    const people = await server.getPeople()
    
    res.render(path.join(__dirname, '/views/person', 'new.html'), { people: people });
});

app.get('/:personId', async (req, res) => {
    const personId = req.params.personId;
    const message = req.query.message;

    const person = await server.getPerson(personId)
    const assets = await server.getAssets(personId)
    res.render(path.join(__dirname, '/views', 'detail.html'), { person: person, assets: assets, message: message });
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