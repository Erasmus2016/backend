/**
 * Created by Manuel on 23.12.2016.
 */

const mysql = require('mysql');

class Database {
    constructor(initCallback) {

        // Get database connection settings from config file.
        this.config = require(APPLICATION_PATH + '/config/db.json');

        // Set up pooled database connection.
        this.pool = mysql.createPool({
            connectionLimit : 100,                  // The amount of maximum connections. Important!
            host            : this.config.host,
            user            : this.config.user,
            password        : this.config.pass,
            database        : this.config.db,
            charset         : 'utf8_general_ci',    // Default charset.
            port            : 3306,                 // Default mySQL port.
            debug           : false
        });

        initCallback(this);
    }

    // Query database and return result as a promise.
    // Database connection will automatically invoked, queried and released back to the pool.
    query(sql, values = []) {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.pool.query(sql, values, function (error, result, fields) {
                if (error) {
                    reject(error);
                }

                resolve(result, fields);
            });
        });
    }
}

module.exports = Database;