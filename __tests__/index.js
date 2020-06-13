const Model = require('../index');

const user = new Model('users', {
    id: {type: Model.INTEGER},
    username: {type: Model.STRING},
    password: {type: Model.STRING},
    firstname: {type: Model.STRING},
    lastname: {type: Model.STRING},
    email: {type: Model.STRING}
});

it('expects model to be initialized and successfully generate insert query', () => {
    const newUser = user.create({
        username: "okjool",
        password: "123456",
        firstname: "Olayinka",
        lastname: "Okewale"
    });
    const expectedQuery = "INSERT INTO users (username,password,firstname,lastname) VALUES ('okjool','123456','Olayinka','Okewale')";
    console.log(`Returned: ${newUser.toString()}\n\nExpected: ${expectedQuery}`);
    expect(newUser.toString()).toBe(expectedQuery);
});

it('expects model to execute', async () => {
    const newUser = user.create({
        username: "okjool",
        password: "123456",
        firstname: "Olayinka",
        lastname: "Okewale",
        email:"okjool2012@gmail.com"
    });
    const result = await newUser.execute();
    console.log("Result =>", result);
    // expect(newUser.toString()).toBe(expectedQuery);
});

it('should run the query', async () => {
    const query = "SELECT * FROM users";
    const exec = await Model.runSql(query);
    console.log("Raw SQL =>", exec);
    expect(typeof exec == "object").toBe(true);
});