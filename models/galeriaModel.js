var pool = require('./bd');

async function getFotos(){
    try {
        var query = 'SELECT * FROM fotosgaleria';
        var rows = await pool.query(query);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function insertFoto(obj){
    try {
        var query = 'INSERT INTO fotosgaleria SET ?';
        var rows = await pool.query(query, [obj]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function deleteFotoById(id){
    try {
        var query = 'DELETE FROM fotosgaleria WHERE id = ?';
        var rows = await pool.query(query, [id]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getFotoById(id){
    try {
        var query = 'SELECT * FROM fotosgaleria WHERE id = ?';
        var rows = await pool.query(query, [id]);
        return rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function updateFotoById(obj, id){
    try {
        var query = 'UPDATE fotosgaleria SET ? WHERE id = ?';
        var rows = await pool.query(query, [obj, id]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = { getFotos, insertFoto, deleteFotoById, getFotoById, updateFotoById };