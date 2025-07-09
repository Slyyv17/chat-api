require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectToMongo() {
  try {
    await client.connect();
    db = client.db('nexus-app'); // You can access collections from this
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
}

function getDB() {
  if (!db) {
    throw new Error('DB not connected yet! Call connectToMongo first.');
  }
  return db;
}

module.exports = {
  connectToMongo,
  getDB,
};