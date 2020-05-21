const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'jePerltRandomWebshop';


async function connectDatabase() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, function (err, client) {
      if (err) {
        reject(err);
      }
      const db = client.db(dbName);
      resolve({ db, client });
    });
  })
}

async function createOne(object, collectionName) {
  let { client, db } = await connectDatabase();
  const collection = db.collection(collectionName);

  return new Promise((resolve, reject) => {
    collection.insertOne(object, (err) => {
      if (err) {
        client.close();
        reject(err);
        return;
      }
      client.close();
      let id = object["_id"].toHexString();
      resolve(id);
    });
  })
}

async function get(query, collectionName) {
  let { client, db } = await connectDatabase();
  const collection = db.collection(collectionName);
  try {
    let res = await collection.find(query).toArray();
    return res;
  } finally {
    client.close();
  }
}

async function update(query, value, collectionName) {
  let { client, db } = await connectDatabase();
  const collection = db.collection(collectionName);
  try {
    return new Promise((resolve, reject) => {
      collection.updateOne(query, value, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    })
  } finally {
    client.close();
  }
}

async function findOrdersWithCityConnection(to) {
  let { client, db } = await connectDatabase();
  const collection = db.collection("orders");
  try {
    let res = await collection.find({ route: { $elemMatch: { to } }, isDelivered: false }).toArray();
    return res;
  } finally {
    client.close();
  }
}



module.exports = { createOne, findOrdersWithCityConnection, update, get };