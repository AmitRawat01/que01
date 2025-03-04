const { MongoClient, ObjectId } = require("mongodb");
const md5 = require("md5");

const uri = mongodb+srvmongodb+srv//user2025:user2500@cluster0.gzh1q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const client = new MongoClient(uri);

async function insertUsersAndProfiles() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("MyDatabase");
        const usersCollection = db.collection("Users");
        const usersProfileCollection = db.collection("UsersProfile");

        const users = [
            { first_name: "abc", last_name: "xyz", email: "abc@example.com", password: "pass123" },

            { first_name: "def", last_name: "uvw", email: "def@example.com", password: "mypassword" },
            { first_name: "ghi", last_name: "rst", email: "ghi@example.com", password: "securepass" },
            { first_name: "jkl", last_name: "opq", email: "jkl@example.com", password: "hello123" },
            { first_name: "mno", last_name: "lmn", email: "mno@example.com", password: "mno1234" }
        ];

        let userProfiles = [];

        for (let user of users) {
            user.password = md5(user.password);
            let result = await usersCollection.insertOne(user);
            console.log(`User added: ${user.first_name} ${user.last_name}`);

            let userProfile = {
                user_id: result.insertedId,
                dob: "2000-01-01",
                mobile_no: "1234567890"
            };

            userProfiles.push(userProfile);
        }

        if (userProfiles.length > 0) {
            await usersProfileCollection.insertMany(userProfiles);
            console.log("All user profiles inserted!");
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await client.close();
        console.log("Connection closed");
    }
}

insertUsersAndProfiles();
