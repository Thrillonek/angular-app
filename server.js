const express = require('express');
const sqlite = require('sqlite3');
const session = require('express-session');
const bcrypt = require('bcrypt');
const app = express();

const db = new sqlite.Database('./database.db', sqlite.OPEN_READWRITE, (err) => {
    if(err) return console.error(err.message);
});

app.use(session({
    secret: 'DMSAKO2"34:1/3MRUIESDFH79S',
    resave: false,
    saveUninitialized: false,
}))

app.use(express.static(__dirname + '/dist/angular-app'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dist/angular-app/index.html');
});

app.get('/api/get-messages', (req, res) => {
    db.all('SELECT * FROM messages', [], (err, rows) => {
        if(err) return res.status(500).json({ message: 'Internal Server Error' });
        res.status(200).json({ rows: rows });
    })
});

app.post('/api/send', (req, res) => {
    let { message } = req.body;
    let sql = 'INSERT INTO messages (text, user) VALUES ('+message+', '+req.session.username+')';
    db.run(sql, (err) => err && res.status(500).json({ message: 'Internal Server Error' }));
    res.status(200).json({ message: message });
});

app.post('/api/register', async (req, res) => {
    let { username, password, email } = req.body;
    if(username.includes('\'') || username.includes('@')) return res.status(403).json({ message: 'Username must not contain apostrophes and asperands (@).' });

    let hashedPassword = await bcrypt.hash(password, bcrypt.genSalt(6));

    db.run(`INSERT INTO users (username, password) VALUES (${username}, ${hashedPassword})`);
    if(email) db.run(`INSERT INTO users (username, password, email) VALUES (${username}, ${hashedPassword}, ${email})`);

    req.session.username = username;
    req.session.password = hashedPassword.toString();
    if(email) req.session.email = email;

    res.sendStatus(201);
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if(username && password) {
        db.all('SELECT * FROM users WHERE username = '+username.toString(), [], (rows, err) => {
            if(!rows || rows.length < 1) return res.status(404).json({ message: 'Username does not exist.' });
            if(err) return res.status(500).json({ message: err.message });
            if(bcrypt.compare(password, rows[0].password)){
                req.session.authenticated = true;
                return res.sendStatus(200);
            } else {
                return res.status(401).json({ message: 'Password is incorrect.' });
            }
        });
    } else {
        return res.sendStatus(400);
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) return res.status(400).json({ message: 'Logout unsuccesful.' });
        else return res.status(200).json({ message: 'Logout succesful.' });
    })
})

app.get('/api/get-user', (req, res) => {
    if(req.session.authenticated) {
        return res.status(200).json({ username: req.session.username });
    } else {
        return res.status(401).json({ message: 'This user is not authenticated' });
    }
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('http://localhost:'+PORT)); 

// player: {"Name":"Player","Prefix":0,"Class":6,"Level":247,"Armor":14754,"Runes":{"ResistanceFire":4,"ResistanceCold":4,"ResistanceLightning":4,"Health":2},"Dungeons":{"Player":12,"Group":39},"Fortress":{"Gladiator":8},"Potions":{"Life":25},"Items":{"Hand":{"HasEnchantment":true},"Wpn1":{"DamageMin":296,"DamageMax":756,"HasEnchantment":true,"AttributeTypes":{"2":42},"Attributes":{"2":3}},"Wpn2":{"DamageMin":0,"DamageMax":0,"HasEnchantment":false,"AttributeTypes":{"2":0},"Attributes":{"2":0}}},"BlockChance":25,"Strength":{"Total":11202},"Dexterity":{"Total":3000},"Intelligence":{"Total":2950},"Constitution":{"Total":8538},"Luck":{"Total":6410}}
// bert: {"Name":"Bert","Prefix":0,"Class":1,"Level":247,"Armor":11105,"Runes":{"ResistanceFire":4,"ResistanceCold":5,"ResistanceLightning":2,"Health":1},"Dungeons":{"Player":12,"Group":39},"Fortress":{"Gladiator":8},"Potions":{"Life":25},"Items":{"Hand":{"HasEnchantment":true},"Wpn1":{"DamageMin":380,"DamageMax":560,"HasEnchantment":true,"AttributeTypes":{"2":40},"Attributes":{"2":2}},"Wpn2":{"DamageMin":0,"DamageMax":0,"HasEnchantment":false,"AttributeTypes":{"2":0},"Attributes":{"2":0}}},"BlockChance":25,"Strength":{"Total":8458},"Dexterity":{"Total":579},"Intelligence":{"Total":560},"Constitution":{"Total":6432},"Luck":{"Total":4339}}
// mark: {"Name":"Mark","Prefix":0,"Class":2,"Level":247,"Armor":2168,"Runes":{"ResistanceFire":0,"ResistanceCold":0,"ResistanceLightning":7,"Health":1},"Dungeons":{"Player":12,"Group":39},"Fortress":{"Gladiator":8},"Potions":{"Life":25},"Items":{"Hand":{"HasEnchantment":true},"Wpn1":{"DamageMin":731,"DamageMax":1681,"HasEnchantment":true,"AttributeTypes":{"2":41},"Attributes":{"2":2}},"Wpn2":{"DamageMin":0,"DamageMax":0,"HasEnchantment":false,"AttributeTypes":{"2":0},"Attributes":{"2":0}}},"BlockChance":25,"Strength":{"Total":661},"Dexterity":{"Total":534},"Intelligence":{"Total":7728},"Constitution":{"Total":5933},"Luck":{"Total":4726}}
// kunigunde: {"Name":"Kunigunde","Prefix":0,"Class":3,"Level":247,"Armor":4504,"Runes":{"ResistanceFire":4,"ResistanceCold":8,"ResistanceLightning":4,"Health":2},"Dungeons":{"Player":12,"Group":39},"Fortress":{"Gladiator":8},"Potions":{"Life":25},"Items":{"Hand":{"HasEnchantment":true},"Wpn1":{"DamageMin":519,"DamageMax":741,"HasEnchantment":true,"AttributeTypes":{"2":40},"Attributes":{"2":3}},"Wpn2":{"DamageMin":0,"DamageMax":0,"HasEnchantment":false,"AttributeTypes":{"2":0},"Attributes":{"2":0}}},"BlockChance":25,"Strength":{"Total":913},"Dexterity":{"Total":7838},"Intelligence":{"Total":535},"Constitution":{"Total":7111},"Luck":{"Total":4404}}
// mates: {"Name":"Player","Prefix":0,"Class":2,"Level":95,"Armor":568,"Runes":{"ResistanceFire":0,"ResistanceCold":0,"ResistanceLightning":0,"Health":0},"Dungeons":{"Player":0,"Group":6},"Fortress":{"Gladiator":0},"Potions":{"Life":25},"Items":{"Hand":{"HasEnchantment":true},"Wpn1":{"DamageMin":153,"DamageMax":459,"HasEnchantment":true,"AttributeTypes":{"2":0},"Attributes":{"2":0}},"Wpn2":{"DamageMin":0,"DamageMax":0,"HasEnchantment":false,"AttributeTypes":{"2":0},"Attributes":{"2":0}}},"BlockChance":25,"Strength":{"Total":240},"Dexterity":{"Total":241},"Intelligence":{"Total":3342},"Constitution":{"Total":1779},"Luck":{"Total":1040}}
