const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const port = 8000;

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
            res.send('File uploaded and validated successfully!');
        });
});

function validateCSVColumns(columns) {
    const requiredColumns = ['Employee ID', 'Company', 'Industry', 'Work Hours', 'Vacation Hours'];
    return requiredColumns.every(col => columns.includes(col));
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
