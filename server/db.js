const mysql = require('mysql2/promise');

class DataBase {
    static conn;

    static async connect(config) {
        this.conn = await mysql.createConnection(config);
    }

    static async query(sql ,params) {
        const [rows, fields] = await this.conn.execute(sql, params);

        return rows;
    }
}

module.exports = DataBase;