const sqlString = require('sqlstring');

global.not = (value) => {
    return [`!=${Q.getValue(value)}`];
};
global.eq = (value) => {
    return [`=${Q.getValue(value)}`];
};
global.lt = (value) => {
    return [`<${Q.getValue(value)}`];
};
global.gt = (value) => {
    return [`>${Q.getValue(value)}`];
};
global.lteq = (value) => {
    return [`<=${Q.getValue(value)}`];
};
global.gteq = (value) => {
    return [`>=${Q.getValue(value)}`];
};

// global.$$ = Q;

class Q {
    static getValue(value) {
        switch(typeof value) {
            case "string":
                return Q.escape(value);
            case "number":
                return value;
            case "boolean":
                return (value) ? 1 : 0;
            default:
                return Q.escape(value);
        }
    }

    /**
     * Create the mysql escape string
     * Using sqlstring module from:
     * https://www.npmjs.com/package/sqlstring
     * @param {String} str The string to perform mysql escape on
     */
    static escape(str) {
        return sqlString.escape(str);
    }
}

module.exports = {
    Q
};