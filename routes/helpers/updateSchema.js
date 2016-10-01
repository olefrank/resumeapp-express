module.exports = function (schema, data) {
    var props = {};

    schema.schema.eachPath(function (path) {

        if (data.hasOwnProperty(path)) {
            props[path] = data[path];
        }
    });

    return schema(props);
};