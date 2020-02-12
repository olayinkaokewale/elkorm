const Exec = require('../executor');

it('expects executor to properly construct', async () => {

    const executor = new Exec();
    executor.execute("SELECT * FROM test");
});