const http = require('http');
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://user10:user1000@cluster0.gzh1q.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

const calculateAverageAge = async () => {
  await client.connect();
  const db = client.db("user1");
  const usersProfileCollection = db.collection("UsersProfile");

  const usersProfiles = await usersProfileCollection.find().toArray();
  const currentDate = new Date();
  let totalAge = 0;

  for (let i = 0; i < usersProfiles.length; i++) {
    const dob = new Date(usersProfiles[i].dob);
    console.log(`DOB: ${dob}`);
    const ageInMilliseconds = currentDate - dob; 
    const ageInYears = new Date(ageInMilliseconds).getUTCFullYear() - 1970; 
    console.log(`Age in years: ${ageInYears}`);
    totalAge += ageInYears;
  }

  await client.close();
  return totalAge / usersProfiles.length;
};

const deleteUserOlderThan25 = async () => {
  await client.connect();
  const db = client.db("user1");
  const usersCollection = db.collection("Users");
  const usersProfileCollection = db.collection("UsersProfile");

  const currentDate = new Date();
  const thresholdDate = new Date(currentDate.getFullYear() - 25, currentDate.getMonth(), currentDate.getDate());
  const profilesToDelete = await usersProfileCollection.find({ dob: { $lt: thresholdDate } }).toArray();

  const userIds = [];
  for (let i = 0; i < profilesToDelete.length; i++) {
    userIds.push(profilesToDelete[i].user_id);
  }

  if (userIds.length > 0) {
    await usersProfileCollection.deleteMany({ user_id: { $in: userIds } });
    await usersCollection.deleteMany({ _id: { $in: userIds } });
  }

  await client.close();
  return userIds;
};

http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/average-age') {
    try {
      const averageAge = await calculateAverageAge();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ averageAge }));
    } catch (e) {
      console.error(e);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'An error occurred while calculating the average age.' }));
    }
  } else if (req.method === 'GET' && req.url === '/delete-users-older-than-25') {
    try {
      const deletedUserIds = await deleteUserOlderThan25();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: deletedUserIds.length > 0 ? 'Deleted users older than 25 years' : 'No users older than 25 years found', deletedUserIds }));
    } catch (e) {
      console.error(e);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'An error occurred while deleting users.' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
}).listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
