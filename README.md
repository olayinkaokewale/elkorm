# ElkORM _(v 0.0.1)_
ElkORM is a library for Node JS/Express JS projects which would help in the elimination of SQL queries in codes (cleaner codes). 

It is basically an ORM (Object Relational Mapping) library limited to **MySQL** for now but plans are in place to extend to other SQL and NoSQL types in the future.

## Installation
**STEP 1**: Install via NPM using the command below:
> npm install elkorm@latest

**STEP 2**: In your project, you can either create a `.env` file or create an `elkorm.json` file having the following keys with their respective values: 


| Key | Description |
|-----------------|--------------------|
| ELK_DATABASE | Type of database being used. e.g. mysql, postgre, mssql, etc. Defaults to mysql |
| ELK_USER | Username of the database |
| ELK_PASS | Password of the database |
| ELK_HOST | Database host e.g. localhost |
| ELK_DB_NAME | Database name |
| ELK_PORT | Database port. Defaults to 3306 |

Example of a `.env` file:
```env
...

ELK_DATABASE=mysql
ELK_USER=root
ELK_PASS=
ELK_HOST=localhost
ELK_DB_NAME=elkorm_db
ELK_PORT=3306

...
```

Example of a `elkorm.json` file:
```json
{
    "ELK_DATABASE": "mysql",
    "ELK_USER": "root",
    "ELK_PASS": "",
    "ELK_HOST": "localhost",
    "ELK_DB_NAME": "elkorm_db",
    "ELK_PORT": 3306
}
```

## Usage
Include this library into your project by importing or requiring it. Check the example below:

```js
const Model = require("elkorm"); // If you're using Common JS model.
// OR
import Model from "elkorm"; // If you're using Javascript import model.
```

Inside your model, you can decide to extend the model class to inherit the defined `CRUD` methods. Example below:

```js
class User extends Model {
    ...
    constructor() {
        const table = "user"; // <-- Name of the table to map to.
        const columns = {
            id: {type: "int", notNull: true},
            username: {type: "string", notNull: true},
            password: {type: "string", notNull: true},
            fullname: {type: "string", notNull: true}
        } // <-- Columns of the table.

        super(table, columns); // <-- Pass the table and columns into the parent class to register them.
    }
    ...
}
```

## Methods

- [create](#create)
- [read](#read)
- [update](#update)
- [delete](#delete)
- [truncate](#truncate)
- [where](#where)
- [and](#and)
- [or](#or)
- [orderBy](#orderBy)
- [limit](#limit)
- [toString](#toString)
- [execute (async)](#execute%20async)

### create
> create(hashmap={})

**`create`** method generates an sql `INSERT` query which must be executed to run. See example on how it is used below:

(NOTE: Use [execute()](#execute) method to run the query.)

SQL Query:
```sql
INSERT INTO `users` (username,password,fullname) VALUES ("olayinkaokewale","914b9c17b4ea373bc4981bbf867df186","Olayinka Okewale");
```

Equivalent **elkorm** implementation:
```js
const user = new User(); // <-- This is the User model we created earlier.

user.create({
    username: "olayinkaokewale",
    password: "914b9c17b4ea373bc4981bbf867df186",
    fullname:"Olayinka Okewale"
});
```

### read
> read(selectData=[])

**`read`** method is used to generate the sql `SELECT` query. See example on how it is used below:

(NOTE: Use [execute()](#execute) method to run the query.)

SQL Query:
```sql
1. SELECT id,username,fullname FROM `users`;
2. SELECT * FROM `users`;
```

Equivalent **elkorm** implementation:
```js
const user = new User(); // <-- This is the User model we created earlier.

1. user.read(["id","username","fullname"]);
2. user.read();
```

### update
> update(columnHashmap = {})

**`update`** method generates the sql `UPDATE` query. See example on how it is used below:

(NOTE: Use [execute()](#execute) method to run the query.)

SQL Query:
```sql
UPDATE `users` SET (username="okjool",fullname="Okewale Olayinka");
```

Equivalent **elkorm** implementation:
```js
const user = new User(); // <-- This is the User model we created earlier.

user.update({
    username: "okjool",
    fullname: "Okewale Olayinka"
});
```

### delete
> delete()

**`delete`** method generates the sql `DELETE` query. See example on how it is used below:

(NOTE: Use [execute()](#execute) method to run the query.)

SQL Query:
```sql
DELETE FROM `users`;
```

Equivalent **elkorm** implementation:
```js
const user = new User(); // <-- This is the User model we created earlier.

user.delete();
```

### truncate
> truncate()

**`truncate`** method generates the sql `TRUNCATE` query. See example on how it is used below:

(NOTE: Use [execute()](#execute) method to run the query.)

SQL Query:
```sql
TRUNCATE TABLE `users`;
```

Equivalent **elkorm** implementation:
```js
const user = new User(); // <-- This is the User model we created earlier.

user.truncate();
```

### where
> where(hashmap={}, concat=Model.AND)

**`where`** method is used to generate the equivalent sql `WHERE` query and it must be chained with other model methods like [read()](#read), [update()](#update) or [delete()](#delete).

`concat` parameter can either be `Model.AND` to concatenate hashmap entities with sql `AND` or `Model.OR` to concatenate hashmap entries with sql `OR` (default is `Model.AND`)

See examples below:

SQL Query:
```sql
# Query 1:
SELECT id,username,fullname FROM `users` WHERE username='okjool' AND password='914b9c17b4ea373bc4981bbf867df186';

# Query 2:
SELECT id,username,fullname FROM `users` WHERE username='okjool' OR email='olayinkaokewale@gmail.com';
```

Equivalent **elkorm** implementation:
```js
const user = new User(); // <-- This is the User model we created earlier.

// Implementation 1:
user.read(["id","username","fullname"]).where({
    username: "okjool",
    password: "914b9c17b4ea373bc4981bbf867df186"
}, User.AND);

// Implementation 2:
user.read(["id","username","fullname"]).where({
    username: "okjool",
    email: "olayinkaokewale@gmail.com"
}, User.OR);
```


### and
> and(hashmap={}, concat=Model.AND)

**`and`** method is used to join selection rule to query to form equivalent `AND` in sql query. It must be chained with model methods like [where()](#where), [and()](#and) or [or()](#or).

`concat` parameter can either be `Model.AND` to concatenate hashmap entities with sql `AND` or `Model.OR` to concatenate hashmap entries with sql `OR` (default is `Model.AND`).

See examples below:
SQL Query:
```sql
# Query 1:
SELECT id,username,fullname FROM `users` WHERE (username='okjool' OR email='olayinkaokewale@gmail.com') AND password='914b9c17b4ea373bc4981bbf867df186';
```

Equivalent **elkorm** implementation:
```js
const user = new User(); // <-- This is the User model we created earlier.

// Implementation 1:
user.read(["id","username","fullname"]).where({
    username: "okjool",
    email: "olayinkaokewale@gmail.com"
}, User.OR).and({
    password: "914b9c17b4ea373bc4981bbf867df186"
});
```


### or
> or(hashmap={}, concat=Model.AND)

**`or`** method is used to join selection rule to query to form equivalent `OR` in sql query. It must be chained with model methods like [where()](#where), [and()](#and) or [or()](#or).

`concat` parameter can either be `Model.AND` to concatenate hashmap entities with sql `AND` or `Model.OR` to concatenate hashmap entries with sql `OR` (default is `Model.AND`).

See examples below:

SQL Query:
```sql
# Query 1:
SELECT id,username,fullname FROM `users` WHERE (username='okjool' AND password='914b9c17b4ea373bc4981bbf867df186') OR (email='olayinkaokewale@gmail.com' AND password='914b9c17b4ea373bc4981bbf867df186');
```

Equivalent **elkorm** implementation:
```js
const user = new User(); // <-- This is the User model we created earlier.

// Implementation 1:
user.read(["id","username","fullname"]).where({
    username: "okjool",
    password: "914b9c17b4ea373bc4981bbf867df186"
}).or({
    email: "olayinkaokewale@gmail.com"
    password: "914b9c17b4ea373bc4981bbf867df186"
});
```

### orderBy
> orderBy(hashmap={ column: Model.ASC | Model.DESC })

**`orderBy`** method is used to join selection rule to query to form equivalent `ORDER BY` in sql query. It must be chained with model methods like [where()](#where), [and()](#and) or [or()](#or).

`Model.ASC` - value for key to depict order by column in ascending order.
`Model.DESC` - value for key to depict order by column in descending order.

See the examples below:

SQL Query:
```sql
# Query 1:
SELECT id,username,fullname FROM `users` WHERE (username='okjool' AND password='914b9c17b4ea373bc4981bbf867df186') OR (email='olayinkaokewale@gmail.com' AND password='914b9c17b4ea373bc4981bbf867df186') ORDER BY (id ASC,username DESC);
```

Equivalent **elkorm** implementation:
```js
const user = new User(); // <-- This is the User model we created earlier.

// Implementation 1:
user.read(["id","username","fullname"]).where({
    username: "okjool",
    password: "914b9c17b4ea373bc4981bbf867df186"
}).or({
    email: "olayinkaokewale@gmail.com"
    password: "914b9c17b4ea373bc4981bbf867df186"
}).orderBy({id: User.ASC, username: User.DESC});
```

### limit
> limit(limit=0, offset=0)

**`limit`** is used to set limit of selected rows in a database. It is equivalent to sql `LIMIT`

See examples below:

SQL Query:
```sql
# Query 1:
SELECT id,username,fullname FROM `users` WHERE (username='okjool' AND password='914b9c17b4ea373bc4981bbf867df186') OR (email='olayinkaokewale@gmail.com' AND password='914b9c17b4ea373bc4981bbf867df186') ORDER BY (id ASC,username DESC) LIMIT 1,10;
```

Equivalent **elkorm** implementation:
```js
const user = new User(); // <-- This is the User model we created earlier.

// Implementation 1:
user.read(["id","username","fullname"]).where({
    username: "okjool",
    password: "914b9c17b4ea373bc4981bbf867df186"
}).and({
    email: "olayinkaokewale@gmail.com"
    password: "914b9c17b4ea373bc4981bbf867df186"
}).orderBy({id: User.ASC, username: User.DESC}).limit(1,10);
```

### toString
> toString()

This method is used to convert your built query chain to string and output the equivalent sql query. See example below:

Input:
```js
const user = new User(); // <-- This is the User model we created earlier.

// Implementation 1:
const selectUser = user.read(["id","username","fullname"]).where({
    username: "okjool",
    password: "914b9c17b4ea373bc4981bbf867df186"
}).and({
    email: "olayinkaokewale@gmail.com"
    password: "914b9c17b4ea373bc4981bbf867df186"
}).orderBy({id: User.ASC, username: User.DESC}).limit(1,10);

console.log(selectUser.toString());
```

Output:
```js
// Console output:

SELECT id,username,fullname FROM `users` WHERE (username='okjool' AND password='914b9c17b4ea373bc4981bbf867df186') OR (email='olayinkaokewale@gmail.com' AND password='914b9c17b4ea373bc4981bbf867df186') ORDER BY (id ASC,username DESC) LIMIT 1,10;
```

### execute (async)
> execute()

This method is used at the end of every chain to execute the query that has been built to [create](#create), [read](#read), [update](#update), [delete](#delete) or [truncate](#truncate). It is an async method that returns either a success or failed promise.

See example below:

```js
const user = new User(); // <-- This is the User model we created earlier.

// Implementation 1:
const selectUser = user.read(["id","username","fullname"]).where({
    username: "okjool",
    password: "914b9c17b4ea373bc4981bbf867df186"
}).and({
    email: "olayinkaokewale@gmail.com"
    password: "914b9c17b4ea373bc4981bbf867df186"
}).orderBy({id: User.ASC, username: User.DESC}).limit(1,10);

selectUser.execute()
.then(data => {
    console.log(data); // <-- You can view what is in your data.
    /**
     * Note that data will contain different structure based on 
     * the type of query you are running. create, read, update,
     * or delete
     */
})
.catch(error => {
    console.log(error); // <-- Always good to log errors.
})
```

## Contributing
To contribute to this project please follow the steps below:
1. Open an issue and discuss what feature you think needed to be added and check if nobody is already working on that feature.
2. Fork this repository and run `docker-compose up -d` to spin off the docker container needed to run the test-cases included.
3. Include a documentation regarding the feature change
4. Create a pull request and wait for your change to be accepted and integrated to this project.

<!-- NOTE: This project was started by [Olayinka Okewale](https://github.com/olayinkaokewale)
on 15th August, 2019. If you'd love to contribute to this project fork, add your code and create a pull request. Also, you can send me a mail at [okjool2012@gmail.com](mailto:okjool2012@gmail.com) -->

## Support Us
If you like this project please give a star and follow me on my social media networks.

[![alt text](https://img.icons8.com/small/32/000000/linkedin.png)](https://www.linkedin.com/in/olayinkaokewale)
[![alt text](https://img.icons8.com/small/32/000000/instagram-new.png)](https://www.instagram.com/olayinkaokewale)
[![alt text](https://img.icons8.com/small/32/000000/twitter.png)](https://www.twitter.com/olayinkaokewale)
