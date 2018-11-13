var mysql = require('mysql');

exports.load = function(sql) {
    return new Promise((resolve, reject) => {
        var connection = mysql.createConnection({
            host: '127.0.0.1',
            port: '3306',
            user: 'root',
            password: '',
            database: 'website_tuvan'
        });

        connection.connect();

        connection.query(sql, (error, results, fields) => {
            if (error)
                reject(error);
            else resolve(results);

            connection.end();
        });
    });
}

exports.write = function(sql) {
    return new Promise((resolve, reject) => {
        var connection = mysql.createConnection({
            host: '127.0.0.1',
            port: '3306',
            user: 'root',
            password: '',
            database: 'website_tuvan'
        });

        connection.connect();

        connection.query(sql, (error, results) => {
            if (error)
                reject(error);
            else resolve(results);

            connection.end();
        });
    });
}