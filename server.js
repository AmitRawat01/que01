const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const md5 = require('md5');

const app = express();
const port = 3000;
const uri = 'mongodb+srv://user3:user3000@cluster0.nehx9.mongodb.net/user30?retryWrites=true&w=majority&appName=Cluster0'; // Updated with your MongoDB Atlas connection string
const dbName = 'user30';
const client = new MongoClient(uri);

app.use(express.json());

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1); // Exit if unable to connect to database
    }
}

app.get('/', (req, res) => {
    res.send('Welcome to the Node.js server!');
});

app.get('/users', async (req, res) => {
    try {
        const db = client.db(dbName);
        const usersCollection = db.collection('Users');
        const users = await usersCollection.find({}).toArray();
        console.log('Fetched users:', users);
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
});

app.get('/profiles', async (req, res) => {
    try {
        const db = client.db(dbName);
        const usersProfileCollection = db.collection('UsersProfile');
        const profiles = await usersProfileCollection.find({}).toArray();
        console.log('Fetched profiles:', profiles);
        res.json(profiles);
    } catch (error) {
        console.error('Error fetching profiles:', error);
        res.status(500).send('Error fetching profiles');
    }
});

async function run() {
    try {
        const db = client.db(dbName);
        const usersCollection = db.collection('Users');
        const usersProfileCollection = db.collection('UsersProfile');

        const dummyUsers = [
            {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                password: md5('password1')
            },
            {
                first_name: 'Jane',
                last_name: 'Doe',
                email: 'jane.doe@example.com',
                password: md5('password2')
            },
            {
                first_name: 'Alice',
                last_name: 'Smith',
                email: 'alice.smith@example.com',
                password: md5('password3')
            },
            {
                first_name: 'Bob',
                last_name: 'Brown',
                email: 'bob.brown@example.com',
                password: md5('password4')
            },
            {
                first_name: 'Charlie',
                last_name: 'Davis',
                email: 'charlie.davis@example.com',
                password: md5('password5')
            }
        ];

        const result = await usersCollection.insertMany(dummyUsers);

        const dummyProfiles = Object.values(result.insertedIds).map(userId => ({
            user_id: userId,
            dob: '1990-01-01',
            mobile_no: '1234567890'
        }));

        await usersProfileCollection.insertMany(dummyProfiles);
        console.log('Inserted 5 users and their profiles');
    } catch (error) {
        console.error('Error inserting users and profiles:', error);
    }
}

connectToDatabase().then(() => {
    run().catch(console.dir);
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
});
