const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const cors = require('cors');
const fs = require('fs');


const app = express();
const port = 8080;
app.use(cors());


const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('csv'), (req, res) => {
    const results = [];
    const errors = [];
    let rowIndex = 0; // Initialize a counter for row index

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
            results.push(data);
        
            // Increment the row index for each row
            rowIndex++;
        
            // Trim the keys in the data object
            const trimmedData = {};
            Object.keys(data).forEach(key => {
                trimmedData[key.trim()] = data[key];
            });
        
            // Now, you can access the trimmed keys without any issue
            const employeeID = Number(trimmedData['Employee_ID']);
            const company = trimmedData['Company'];
            const industry = trimmedData['Industry'];
            const workHours = Number(trimmedData['Work Hours']);
            const vacationHours = Number(trimmedData['Vacation Hours']);
            // console.log({employeeID, company, industry, workHours, vacationHours})

            // Validate Employee ID
            if (!Number.isInteger(employeeID) || employeeID <= 0) {
                errors.push(`Row ${rowIndex}: Employee ID should be a positive integer.`);
            }

            // Validate Company
            if (company.length > 64) {
                errors.push(`Row ${rowIndex}: Company name exceeds 64 characters.`);
            }

            // Validate Industry
            if (industry.length > 64) {
                errors.push(`Row ${rowIndex}: Industry name exceeds 64 characters.`);
            }

            // Validate Work Hours
            if (!Number.isInteger(workHours) || workHours <= 0) {
                errors.push(`Row ${rowIndex}: Work Hours should be a positive integer.`);
            }

            // Validate Vacation Hours
            if (!Number.isInteger(vacationHours) || vacationHours <= 0) {
                errors.push(`Row ${rowIndex}: Vacation Hours should be a positive integer.`);
            }
        })
        .on('end', () => {
            console.log(errors)
            if (errors.length) {
                res.status(400).json({ errors });
            } else {
                res.send({msg: 'File uploaded and validated successfully!'} );
            }
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
