const mysql = require('mysql');

class Database {
    constructor(initCallback) {
        this.config = require(APPLICATION_PATH + '/config/db.json');
        this.connection = mysql.createConnection({
            connectionLimit: 100, //important
            host: this.config.host,
            user: this.config.user,
            password: this.config.pass,
            database: this.config.db,
            // charset         : 'latin1_swedish_ci',
            debug: false
        });
        this.connection.connect();
        initCallback(this);
    }

    query(sql, values = []) {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.connection.query(sql, values, function (err, res, fields) {
                if (err) reject(err);
                resolve(res, fields);
            });
        });
    }
}

module.exports = Database;