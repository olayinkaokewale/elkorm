const db = require('promise-mysql');

class MysqlHandler {
    connectionOption = {};

    constructor(connectionOption) {
        this.connectionOption = connectionOption;
    }

    async execute(str) {
        const req = await db.createConnection(this.connectionOption);
        const res = await req.query(str);
        return res;
    }
}

module.exports = MysqlHandler;