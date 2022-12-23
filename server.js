const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

const queryAll = async (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const queryFirst = async (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

const queryRun = async (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

const getPeople = async () => {
    const sql = `SELECT * FROM Person`;
    const result = await queryAll(sql, []);

    let parentData = {}
    result.forEach(item => {
        parentData[item.id] = {
            name: item.name,
            gender: item.gender,
            parent: item.parent
        };
    });

    const people = result.map((person) => {

        const newPerson = {
            id: person.id,
            name: person.name,
            gender: person.gender,
            parent: (parentData[person.parent])?.name || ""
        }
        return newPerson;
    });

    return people
}

const getPerson = async (id) => {
    const sql = `SELECT * FROM Person WHERE id = ?`;
    const result = await queryFirst(sql, [id]);
    return result
}

const createPerson = async (name, gender, parent) => {
    const sql = `INSERT INTO Person (name, gender, parent) VALUES (?, ?, ?);`
    const result = queryRun(sql, [name, gender, parent])
    return result;
}

const updatePerson = (id, name, gender, parent) => {
    const sql = `UPDATE Person SET name = ?, gender = ?, parent = ? WHERE id = ?`;
    const result = queryRun(sql, [name, gender, parent, id])
    return result;
}

const deletePerson = (id) => {
    const sql = `DELETE FROM Person WHERE id = ?`;
    const result = queryRun(sql, [id]);
    console.log(result);
    return result
}

const getAssets = async (id) => {
    const sql = `SELECT * FROM Asset WHERE person_id = ?`;
    const result = await queryAll(sql, [id]);
    return result
}
module.exports = {
    getPeople: getPeople,
    getPerson: getPerson,
    getAssets: getAssets,
    createPerson: createPerson,
    updatePerson: updatePerson,
    deletePerson: deletePerson
}

