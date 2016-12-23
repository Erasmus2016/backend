/**
 * Created by Manuel on 23.12.2016.
 */

var mysql = require('mysql');
var dbConfigFile = require(APPLICATION_PATH + '/config/db.json');

var pool = mysql.createPool({
    connectionLimit : 100, //important
    host            : dbConfigFile.host,
    user            : dbConfigFile.user,
    password        : dbConfigFile.pass,
    database        : dbConfigFile.db,
    // charset         : 'latin1_swedish_ci',
    debug           :  false
});

function queryDatabasePromise(sql)
{
    return new Promise(function(resolve, reject) {
        // The Promise constructor should catch any errors thrown on
        // this tick. Alternately, try/catch and reject(err) on catch.

        pool.query(sql, function (err, result) {
            // Call reject on error states,
            // call resolve with results
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
}

function queryDatabase(sql) {
    pool.query(sql, function(err, result) {
        if (err) {
            throw err;
        }
        else {
            console.log(result);
            response.release();
            return result;
        }
    });
};

function getConnection() {
    return pool.query();
}

function executeQuery(query, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            return callback(err, null);
        }
        else if (connection) {
            connection.query(query, function (err, rows, fields) {
                connection.release();
                if (err) {
                    return callback(err, null);
                }
                return callback(null, rows);
            })
        }
        else {
            return callback(true, "No Connection");
        }
    });
}

exports.executeQuery = executeQuery;
exports.getConnection = getConnection;
exports.queryDatabase = queryDatabase;
exports.queryDatabasePromise = queryDatabasePromise;