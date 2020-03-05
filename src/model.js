const { Q } = require("./utils/global"); // Import all the global functions.
const Executor = require("./utils/executor");
const executor = new Executor();


class Model {

    // Static GET methods
    static get AND() {return "AND"};
    static get OR() {return "OR"};
    static get ASC() {return "ASC"};
    static get DESC() {return "DESC"};
    static get INTEGER() {return "number"};
    static get STRING() {return "string"};
    static get BOOLEAN() {return "boolean"};
    // The end of it...

    /**
     * 
     * @param {String} prop The parameter that is being required
     */
    required(prop) {
        throw new Error(`${prop} is a required parameter`);
    }

    /**
     * Model constructor to be used using super(table, columns) - in most cases;
     * @param {String} table The table/model name to initialize.
     * @param {Object} columns The columns of the table for proper checking while performing CRUD operations.
     */
    constructor(table=this.required("table"), columns={}) {
        this.table = table;
        this.columns = columns;
        this.query = "";
    }

    // ========================================================================= 
    
    
    /**
     * create method to insert into table(model)
     * @param {Object} hashmap example: {username: "okjool", firstname: "Olayinka"}
     */
    create(hashmap={}) {
        // Initialize the key and values array
        let keys = [], values = [];

        Object.keys(hashmap).map(key => {
            if (this.columns.hasOwnProperty(key)) {
                keys.push(key);
                values.push(Q.getValue(hashmap[key]));
            }
        });

        if (keys.length > 0) {
            // Build the query.
            this.query = `INSERT INTO ${this.table} (${keys.join(",")}) VALUES (${values.join(",")})`;
            return this;
        } else {
            throw new Error("hashmap must contain atleast one property - Error in create()");
        }
    }
    
    /**
     * read method to select from the table(model)
     * @param {Array} columns columns/properties to select while reading from a table/model.
     */
    read(columns=[]) {
        columns = this.getModelColumns(columns); // Retrieve the columns associated with this model from the list of columns
        const sel = (typeof columns == "object" && columns.length > 0) ? columns.join(",") : "*"; // TODO: Perform the column check here
        this.query = `SELECT ${sel} FROM ${this.table}`;
        return this;
    }

    /**
     * update method to update row(s) inside a table(model)
     * @param {Object} hashmap example: {username: "okjool", firstname: "Olayinka"}
     */
    update(hashmap={}) {
        this.query = `UPDATE ${this.table} SET ${this.generateList(hashmap).join(",")}`;
        return this;
    }

    /**
     * delete method to delete row(s) inside a table(model)
     */
    delete() {
        this.query = `DELETE FROM ${this.table}`;
        return this;
    }

    /**
     * truncate method to totally truncate a table(model)
     */
    truncate() {
        this.query = `TRUNCATE ${this.table}`;
        return this;
    }

    // ========================================================================= 

    /**
     * where method - for adding "WHERE" to the Model
     * @param {Object} hashmap object mapping of the item to be joined.
     * @param {Model.AND || Model.OR} concat enum to concatinate hashmap with AND/OR
     * e.g. user.read().where({username: "okjool", password: "123456"}) to be:
     * "SELECT * FROM users WHERE username='okjool' AND password='123456'"
     */
    where(hashmap, concat=Model.AND) {
        this.query = `${this.query} WHERE (${this.generateList(hashmap).join(` ${concat} `)})`;
        return this;
    }

    /**
     * and method - for adding "AND" to the Model
     * @param {Object} hashmap object mapping of the item to be joined.
     * e.g. new Model().and({username: "okjool", password: "123456"}) to be:
     * "username='okjool' AND password='123456'"
     */
    and(hashmap, concat=Model.AND) {
        this.query = `${this.query} AND (${this.generateList(hashmap).join(` ${concat} `)})`;
        return this;
    }

    /**
     * or method - for adding "OR" to the Model
     * @param {Object} hashmap object mapping of the item to be joined.
     * e.g. new Model().or({username: "okjool", password: "123456"}) to be:
     * "username='okjool' OR password='123456'"
     */
    or(hashmap, concat=Model.AND) {
        this.query = `${this.query} OR (${this.generateList(hashmap).join(` ${concat} `)})`;
        return this;
    }

    /**
     * @param {Object} hashmap the hashmap of the columns to order by and the respective order rule: 
     * "asc" for ascending, "desc" for descending
     * e.g. {username: "asc", email: "desc"}
     */
    orderBy(hashmap={}) {
        let orderByQuery = [];
        Object.keys(hashmap).map(key => {
            if (this.columns.hasOwnProperty(key)) {
                orderByQuery.push(`${key} ${String(hashmap[key]).toUpperCase()}`);
            }
        });
        if (orderByQuery.length > 0) this.query = `${this.query} ORDER BY (${orderByQuery.join(",")})`;
        return this;
    }

    /** 
     * @param {Integer} limit the limit of the selected rows
     * @param {Integer} offset the starting position of the rows to be selected from.
     */
    limit(limit=1,offset=0) {
        this.query = `${this.query} LIMIT ${offset},${limit}`;
        return this;
    }

    /**
     * miscellaneous method to output list of queries to be joined
     * @param {Object} hashmap object mapping of the items.
     */
    generateList(hashmap) {
        let list = [];
        Object.keys(hashmap).map(key => {
            if (this.columns.hasOwnProperty(key)) {
                const val = hashmap[key];
                const value = (typeof val == "object") ? val[0] : eq(val)[0];
                list.push(`${key}${value}`);
            }
            
        });
        if (list.length > 0)  return list;
        else throw new Error("At least one parameter must be set. Check that your columns are set appropriately.");
    }

    /**
     * This method returns the columns available inside of the model
     * @param {Array} columns array input of the columns.
     */
    getModelColumns(columns) {
        let trueColumns = [];
        Object.values(columns).map(value => {
            if (this.columns.hasOwnProperty(value)) {
                trueColumns.push(value);
            }
        });
        return trueColumns;
    }

    /**
     * To output the query string without executing - good for debugging
     */
    toString() {
        return this.query;
    }

    /**
     * Execute method to return back the executed query.
     */
    async execute() {
        const query = this.query;
        const result = await executor.execute(query);
        return result;
    }

}

module.exports = Model;