require('dotenv').config();

const appRoot = require('app-root-path');
const fs = require('fs');

const CONFIG_FILE = `${appRoot.path}/elkorm.json`;

const required = function(str) {
    throw new Error(`property ${str} is required in config (elkorm.json) file`);
}

class Executor {
    constructor() {
        // console.log("App Root Path =>", require(CONFIG_FILE));
        // Check if config file is contained
        try {
            let configFile = {};
            if (fs.existsSync(CONFIG_FILE)) {
                configFile = require(CONFIG_FILE);
            } else if (typeof process.env === 'object') {
                configFile = process.env;
            } else {
                throw new Error("Config (elkorm.json or .env) file not found");
            }

            const { 
                ELK_DATABASE="mysql", 
                ELK_HOST=required("ELK_HOST"), 
                ELK_DB_NAME=required("ELK_DB_NAME"), 
                ELK_USER=required("ELK_USER"),
                ELK_PASS=required("ELK_PASS"),
                ELK_PORT=3306
            } = configFile;

            if (String(ELK_DATABASE).toLowerCase().trim() == "mysql") {
                const connectionOption = {
                    host: ELK_HOST,
                    port: ELK_PORT,
                    user: ELK_USER,
                    password: ELK_PASS,
                    database: ELK_DB_NAME,
                    supportBigNumbers: true,
                    bigNumberStrings: true,
                    multipleStatements: true
                };
                const MysqlHandler = require("../databases/mysql-handler");
                this.db = new MysqlHandler(connectionOption);
                // console.log(this.db);
            }
        } catch (err) {
            console.error("An error occured. Please check the error for details", err);
        }
    }

    async execute(query) {
        if (this.db == null || this.db == undefined) throw new Error("No database config found. Please check the documentation for proper implementation of elkorm");
        
        try {
            const response = await this.db.execute(query);
            return response;
        } catch(err) {
            console.log("Execute error =>", err);
        }
    }

}

module.exports = Executor;