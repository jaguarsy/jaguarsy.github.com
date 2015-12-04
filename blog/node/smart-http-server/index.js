/**
 * Created by johnnycage on 15/12/4.
 */

var http = require('http');
var path = require('path');
var Q = require('Q');
var ecstatic = require('ecstatic');

module.exports = function () {
    var defaultPort = 8000;

    function base(port, targetPath) {
        var dfd = Q.defer();

        targetPath = targetPath || '/';

        var server = http.createServer(
            ecstatic({root: path.join(__dirname + '/../..', targetPath)})
        ).listen(port);

        server.on('listening', function () {
            console.log('listen on: http://localhost:' + port);

            dfd.resolve();
        });

        server.on('error', function (err) {
            server.close();
            dfd.reject();
        });

        return dfd.promise;
    }

    function getServer(port, path) {
        base(port, path).catch(function () {
            getServer(port + 1, path);
        });
    }

    return function (path) {
        getServer(defaultPort, path);
    };
}();