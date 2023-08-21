const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const cors = require('cors');
const fs = require('fs');


const app = express();
const port = 8080;
app.use(cors());


const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            // Validate the CSV file columns
            if (results.length === 0 || !validateCSVColumns(Object.keys(results[0]))) {
                return res.status(400).send('Invalid CSV format. Please ensure you have the correct columns.');
            } 
            successMsg = 'File uploaded and validated successfully!';
            console.log( successMsg );
            res.send( {successMsg} );
        });
});

function validateCSVColumns(csvColumns) {
    csvColumns = csvColumns.map(column => column.trim());

    const requiredColumns = ['Employee_ID'];

    for (let requiredCol of requiredColumns) {
        console.log(`Checking for ${requiredCol}:`, csvColumns.includes(requiredCol));
        if (!csvColumns.includes(requiredCol)) {
            return false;
        }
    }
    return true;
}


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
