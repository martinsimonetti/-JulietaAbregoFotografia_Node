var pool = require('./bd');

async function insertSuscripto(obj){
    try {
        var query = 'INSERT INTO suscriptos SET ?';
        var rows = await pool.query(query, [obj]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = { insertSuscripto };