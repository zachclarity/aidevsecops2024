
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-west-2',  // Set the region
    endpoint: 'http://localhost:9911'  // DynamoDB local endpoint
  });

  const dynamoDB = new AWS.DynamoDB();
  const documentClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: 'taes'
  };
  
// Function to list all tables
const listTables = async () => {
  try {
    const data = await documentClient.scan(params).promise();
    console.log('Tables in DynamoDB:', data.Items);
    return data.Items
  } catch (error) {
    console.error('Error listing tables:', error);
  }
};

async function getAll(req, res) {

    let results = await listTables();
    console.log(results)
    res.json(results)
}

async function getOne(req, res) {
    let dodid = req.params.dodid
    let output = await patientsCollection.findOne({dodid})
    res.json(output)
}

async function setOne(req, res) {
    let dodid = req.params.dodid
    let patient = req.body
    delete patient._id
    let resp = await patientsCollection.findOneAndUpdate({dodid}, {$set: {...patient}}, {upsert: true})
    res.json(resp)
}

async function create(req, res) {
    let doc = req.body
    let resp = await patientsCollection.insertOne(doc)
    res.json(resp)
}

async function getDocs(req, res) {
    let dodid = req.params.dodid
    let resp = await docs.findOne({dodid})
    if (!resp) {
        await docs.insertOne({
            dodid,
            docs: []
        })
        resp = {
            dodid,
            docs: []
        }
    }
    console.log(resp)
    res.json(resp.docs)
}

async function setDocs(req, res) {
    let dodid = req.params.dodid
    let incomingDocs = req.body
    console.log(incomingDocs)
    let resp = await docs.findOneAndUpdate({dodid}, {$set: {docs: incomingDocs}})
    res.json(resp)
}

const patients = {
    getAll,
    getOne,
    setOne,
    create,
    getDocs,
    setDocs
}

module.exports = patients