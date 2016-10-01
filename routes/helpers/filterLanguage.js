const traverse = require('traverse');

// filter json obj by language
module.exports = function (language, obj) {
    return traverse(obj).map(function (item) {
        if (this.key === language) {
            this.parent.update(item);
        }
    });
};