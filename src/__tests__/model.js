const Model = require('../model');

it('should return not equals to', () => {
    const q = not("okjool");
    console.log(q);
    expect(typeof q == "object").toBe(true);
})

const users = new Model("users", {username:{}, firstname:{}, lastname:{}, email:{}, password:{}, banned:{}, loggedIn:{}});
const username = "okjool";

it('should key - value mapping', () => {
    const q = users.generateList({username: not(username), email: "okjool2012@gmail.com", password: "1234567", loggedIn: lt(5), banned: false});
    console.log(q);
    expect(typeof q == "object").toBe(true);
});

it('should do simple select query (no where clause)', () => {
    const output = `SELECT firstname,lastname FROM users`;
    const q = users.read(["firstname","lastname"]).toString();
    console.log(q);
    expect(q).toBe(output);
});

it('should do simple select query (with where clause)', () => {
    const output = `SELECT firstname,lastname FROM users WHERE (username='okjool' OR email='okjool') AND (password='1234567')`;
    const q = users.read(["firstname","lastname"]).where({username: "okjool", email: "okjool"},Model.OR).and({password: "1234567"}).toString();
    console.log(q);
    expect(q).toBe(output);
});

it('should do complex select query', () => {
    const output = `SELECT * FROM users WHERE (username!='okjool' AND email='okjool2012@gmail.com' AND password='1234567' AND loggedIn<5 AND banned=0) OR (username='wwweb' OR password='567890')`;
    const q = users.read().where({username: not(username), email: "okjool2012@gmail.com", password: "1234567", loggedIn: lt(5), banned: false}).or({username: "wwweb", password: "567890"}, Model.OR).toString();
    console.log(q);
    expect(q).toBe(output);
});

it('should do complex select query with order by', () => {
    const output = `SELECT * FROM users WHERE (username!='okjool' AND email='okjool2012@gmail.com' AND password='1234567' AND loggedIn<5 AND banned=0) OR (username='wwweb' OR password='567890') ORDER BY (username ASC,email DESC)`;
    const q = users.read().where({username: not(username), email: "okjool2012@gmail.com", password: "1234567", loggedIn: lt(5), banned: false}).or({username: "wwweb", password: "567890"}, Model.OR).orderBy({username:"asc", email:"desc"}).toString();
    console.log(q);
    expect(q).toBe(output);
});

it('should do complex select query with order by and limit', () => {
    const output = `SELECT * FROM users WHERE (username!='okjool' AND email='okjool2012@gmail.com' AND password='1234567' AND loggedIn<5 AND banned=0) OR (username='wwweb' OR password='567890') ORDER BY (username ASC,email DESC) LIMIT 10,0`;
    const q = users.read().where({username: not(username), email: "okjool2012@gmail.com", password: "1234567", loggedIn: lt(5), banned: false}).or({username: "wwweb", password: "567890"}, Model.OR).orderBy({username:"asc", email:"desc"}).limit(10,0).toString();
    console.log(q);
    expect(q).toBe(output);
});

it('should do simple insert query', () => {
    const output = `INSERT INTO users (username,email,password,banned) VALUES ('okjool','okjool2012@gmail.com','1234567',0)`;
    const q = users.create({username:"okjool", email:"okjool2012@gmail.com", password:"1234567", banned:false}).toString();
    console.log(q);
    expect(q).toBe(output);
});

it('should do simple update query', () => {
    const output = `UPDATE users SET (username='wwweb',email='okjool2013@gmail.com',banned=1) WHERE (email='okjool2012@gmail.com' OR username='okjool2012@gmail.com') AND (password='1234567')`;
    const q = users.update({username:"wwweb", email:"okjool2013@gmail.com", banned:true}).where({email:"okjool2012@gmail.com",username:"okjool2012@gmail.com"},Model.OR).and({password:"1234567"}).toString();
    console.log(q);
    expect(q).toBe(output);
});

it('should do simple delete query', () => {
    const output = `DELETE FROM users WHERE (email='okjool2012@gmail.com' OR username='okjool2012@gmail.com') AND (password='1234567')`;
    const q = users.delete().where({email:"okjool2012@gmail.com",username:"okjool2012@gmail.com"},Model.OR).and({password:"1234567"}).toString();
    console.log(q);
    expect(q).toBe(output);
});

it('should do truncate users table', () => {
    const output = `TRUNCATE users`;
    const q = users.truncate().toString();
    console.log(q);
    expect(q).toBe(output);
});