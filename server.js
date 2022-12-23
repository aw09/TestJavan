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

const getPeople = async () => {
    const sql = `SELECT * FROM Person`;
    const result = await queryAll(sql, []);
    return result
}

const getPerson = async (id) => {
    const sql = `SELECT * FROM Person WHERE id = ?`;
    const result = await queryFirst(sql, [id]);
    // console.log(result);
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
    getAssets: getAssets
}

