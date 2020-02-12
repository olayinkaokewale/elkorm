const Model = require('../index');

const user = new Model('users', {
    id: {type: Model.INTEGER},
    username: {type: Model.STRING},
    password: {type: Model.STRING},
    fullname: {type: Model.STRING},
});

it('expects model to be initialized and successfully generate insert query', () => {
    const newUser = user.create({
        username: "okjool",
        password: "123456",
        fullname: "Olayinka Okewale"
    });
    const expectedQuery = "INSERT INTO users (username,password,fullname) VALUES ('okjool','123456','Olayinka Okewale')";
    console.log(`Returned: ${newUser.toString()}\n\nExpected: ${expectedQuery}`);
    expect(newUser.toString()).toBe(expectedQuery);
});

it('expects model to execute', async () => {
    const newUser = user.create({
        username: "okjool",
        password: "123456",
        fullname: "Olayinka Okewale"
    });
    // const expectedQuery = "INSERT INTO users (username,password,fullname) VALUES ('okjool','123456','Olayinka Okewale')";
    const result = await user.execute();
    console.log("Result =>", result);
    // expect(newUser.toString()).toBe(expectedQuery);
});
