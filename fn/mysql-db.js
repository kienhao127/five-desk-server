var mysql = require('mysql');

exports.load = function(sql) {
    return new Promise((resolve, reject) => {
        var connection = mysql.createConnection({
            host: 'us-cdbr-iron-east-01.cleardb.net',
            port: '3306',
            user: 'b375cdf9dcedd3',
            password: 'ae0a1f00',
            database: 'heroku_ae446112e19ccfa'
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
            host: 'us-cdbr-iron-east-01.cleardb.net',
            port: '3306',
            user: 'b375cdf9dcedd3',
            password: 'ae0a1f00',
            database: 'heroku_ae446112e19ccfa'
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