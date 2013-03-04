
const PATH = require("path");
const URL = require("url");


exports.for = function(API, plugin) {

    plugin.resolveLocator = function(locator, options, callback) {
        var self = this;

        if (!locator.url) {
            locator.url = locator.descriptor.pointer;
        }

        locator.getLocation = function(type) {
            var locations = {
                "pointer": locator.url
            };
            locations.path = locator.url;
            locations.archive = locator.url;
            return (type)?locations[type]:locations;
        }

        return callback(null, locator);
    }

    plugin.download = function(uri, options, callback) {

        var parsedUri = URL.parse(uri);

        if (!API.FS.existsSync(parsedUri.pathname)) {
            return callback(null, {
                status: 404,
                cachePath: parsedUri.pathname
            });
        }
        return callback(null, {
            status: 200,
            cachePath: parsedUri.pathname
        });
    }

    plugin.extract = function(fromPath, toPath, locator, options) {
        if (!API.FS.existsSync(PATH.dirname(toPath))) {
            API.FS.mkdirsSync(PATH.dirname(toPath));
        }
        var deferred = API.Q.defer();
        API.FS.copy(fromPath, toPath, function(err) {
            if (err) return deferred.reject(err);
            return deferred.resolve();
        });
        return deferred.promise;
    }

}
