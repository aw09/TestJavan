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
        db.run(sql, params, (err, _) => {
            if (err) {
                reject(err);
            } else {
                resolve('success');
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

const getPersonFromAsset = async (id) => {
    const sql = `SELECT * FROM Person JOIN Asset WHERE Asset.id = ?`;
    const result = await queryFirst(sql, [id]);
    return result
}

const createPerson = async (name, gender, parent) => {
    const sql = `INSERT INTO Person (name, gender, parent) VALUES (?, ?, ?);`
    const result = await queryRun(sql, [name, gender, parent])
    return result;
}

const updatePerson = async (id, name, gender, parent) => {
    const sql = `UPDATE Person SET name = ?, gender = ?, parent = ? WHERE id = ?`;
    const result = await queryRun(sql, [name, gender, parent, id])
    return result;
}

const deletePerson = async (id) => {
    const sql = `DELETE FROM Person WHERE id = ?`;
    const result = await queryRun(sql, [id]);
    return result
}

const getAssets = async (personId) => {
    const sql = `SELECT * FROM Asset WHERE person_id = ?`;
    const result = await queryAll(sql, [personId]);
    return result
}

const getAsset = async (id) => {
    const sql = `SELECT * FROM Asset WHERE id = ?`;
    const result = await queryFirst(sql, [id]);
    return result
}

const createAsset = async (name, personId) => {
    const sql = `INSERT INTO Asset (name, person_id) VALUES (?, ?)`;
    const result = await queryRun(sql, [name, personId]);
    return result
}

const updateAsset = async (id, name, personId) => {
    const sql = `UPDATE Asset SET name = ?, person_id = ? WHERE id = ?`;
    const result = await queryRun(sql, [name, personId, id]);
    return result
}

const deleteAsset = async (id) => {
    const sql = `DELETE FROM Asset WHERE id = ?`;
    const result = await queryRun(sql, [id]);
    return result
}

module.exports = {
    getPeople: getPeople,
    getPerson: getPerson,
    getPersonFromAsset: getPersonFromAsset,
    getAssets: getAssets,
    createPerson: createPerson,
    updatePerson: updatePerson,
    deletePerson: deletePerson,
    getAsset: getAsset,
    createAsset: createAsset,
    updateAsset: updateAsset,
    deleteAsset: deleteAsset
}

