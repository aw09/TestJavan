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


app.get('/', async (req, res) => {
    const people = await server.getPeople()
    let peopleData = {}
    people.forEach(item => {
        peopleData[item.id] = {
            name: item.name,
            gender: item.gender,
            parent: item.parent
        };
    });

    const peopleWithParent = people.map((person) => {

        const newPerson = {
            id: person.id,
            name: person.name,
            gender: person.gender,
            parent: (peopleData[person.parent])?.name || ""
        }
        return newPerson;
    });
    
    res.render(path.join(__dirname, '/views', 'index.html'), { people: peopleWithParent });
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