import express from 'express';
import admin from 'firebase-admin';
import fs from 'fs/promises';
import cors from 'cors';
import { readLocalDataset } from './dataProcessor.js';
import { format } from 'fast-csv'; 

 
const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;
const db = admin.firestore();

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});

// On startup, read dataset and upload
(async () => {
  try {
    const collectionRef = db.collection('automobiles');
    const snapshot = await collectionRef.limit(1).get();

    if (snapshot.empty) {
        const data = await readLocalDataset();
        await uploadDataToFirestore(data);
        console.log('Dataset uploaded successfully during startup.');
    } else {
        console.log('Collection already has data. Skipping upload.');
    }
  } catch (err) {
    console.error('Error during initial dataset upload:', err);
  }
})();

// Function to upload data to Firestore
async function uploadDataToFirestore(dataArray) {
  const collectionRef = db.collection('automobiles');

  for (const item of dataArray) {
    await collectionRef.add(item);
  }
}


// GET API
app.get('/automobiles', async (req, res) => {
    try {
        const collectionRef = db.collection('automobiles');
        const response = await collectionRef.get();
        let responseArr = [];

        response.forEach(doc => {
            responseArr.push(doc.data());
        });

        res.send({
            success: true,
            message: 'Collection returned',
            data: responseArr
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
});


// POST API
app.post('/add/automobile', async (req, res) => {
  try {
    const automobileJson = {
      name: req.body.name,
      mpg: req.body.mpg,
      cylinders: req.body.cylinders,
      displacement: req.body.displacement,
      horsepower: req.body.horsepower,
      weight: req.body.weight,
      acceleration: req.body.acceleration,
      model_year: req.body.model_year,
      origin: req.body.origin
    };

    await db.collection('automobiles').add(automobileJson);

    res.send({
      success: true,
      message: 'Automobile created.'
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});


// GET API for downloading dataset as CSV file
app.get('/download/automobiles', async (req, res) => {
    try {
        const snapshot = await db.collection('automobiles').get();
        const data = snapshot.docs.map(doc => doc.data());

        res.setHeader('Content-Disposition', 'attachment; filename=automobiles.csv');
        res.setHeader('Content-Type', 'text/csv');
        
        const csvStream = format({ headers: true });
        csvStream.pipe(res);

        data.forEach(row => csvStream.write(row));
        csvStream.end();
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to generate CSV.");
    }
});