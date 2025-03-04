require('dotenv').config();

const { MongoClient } = require('mongodb');
const md5 = require('md5');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const users = [
  { firstName: "Virat", lastName: "Kohli", email: "abc@gmail.com", password: md5("password1") },
  { firstName: "Rishab", lastName: "Pant", email: "acd@gmail.com", password: md5("password2") },
  { firstName: "Mahi", lastName: "Dhoni", email: "xyz@gmail.com.com", password: md5("password3") },
  { firstName: "Rohit", lastName: "Sharma", email: "poq@gmail.com", password: md5("password4") },
  { firstName: "Rahul", lastName: "KL", email: "xyzw@gmail.com", password: md5("password5") }
];
async function main() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("user1");
    const usersCollection = db.collection("Users");
    const usersProfileCollection = db.collection("UsersProfile");
    const userInsertResults = await usersCollection.insertMany(users);
    console.log("Inserted users:", userInsertResults);
    if (userInsertResults.insertedCount > 0) {
      const usersProfile = [];
      for (let key in userInsertResults.insertedIds) {
        const userId = userInsertResults.insertedIds[key];
        console.log("User ID:", userId);
        const profile = {
          user_id: userId,
          dob: new Date("1111-01-01"),
          mobile_no: "1234567890"
        };
        usersProfile.push(profile);
      }
      if (usersProfile.length > 0) {
        const profileInsertResults = await usersProfileCollection.insertMany(usersProfile);
        console.log("Inserted user profiles:", profileInsertResults);
        console.log("Users and UsersProfile inserted successfully!");
      } else {
        console.log("No user profiles to insert.");
      }
    } else {
      console.log("No users were inserted.");
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
main().catch(console.error);
