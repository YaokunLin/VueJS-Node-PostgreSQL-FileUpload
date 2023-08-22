const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const cors = require('cors');
const db = require('./db');
const fs = require('fs');


const app = express();
const port = 8080;
app.use(cors());


const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('csv'), (req, res) => {
    console.log('the upload end point is hit')
    const results = [];
    const errors = [];
    let rowIndex = 0; // Initialize a counter for row index

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
        
            // Increment the row index for each row
            rowIndex++;
        
            // Trim the keys in the data object
            const trimmedData = {};
            Object.keys(data).forEach(key => {
                trimmedData[key.trim()] = data[key];
            });

            results.push(trimmedData);
        
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
        .on('end', async () => {
            if (errors.length) {
                res.status(400).json({ errors });
            } else {
                try {
                    // Insert upload timestamp into the uploaded_files table
                    const { rows } = await db.query("INSERT INTO uploaded_files(upload_time) VALUES(NOW()) RETURNING id");
                    const fileId = rows[0].id;
    
                    // Insert each row of data into the employee_data table
                    for (const row of results) {
                        await db.query(`
                            INSERT INTO employee_data(file_id, employee_id, company, industry, work_hours, vacation_hours, overtime_hours)
                            VALUES($1, $2, $3, $4, $5, $6, $7)
                        `, [fileId, row['Employee_ID'], row['Company'], row['Industry'], row['Work Hours'], row['Vacation Hours'], row['Overtime Hours']]);
                    }
    
                    res.send({msg: 'File uploaded and saved to database successfully!'});
                } catch (err) {
                    console.error('Database error:', err);
                    res.status(500).json({ msg: 'Internal server error', detail: err });
                }
            }
        });
    });


app.get('/reports', async (req, res) => {
    console.log('the reports end point is hit');
    try {
        const result = await db.query(`
            SELECT 
                industry,
                AVG(work_hours) as avg_work_hours,
                AVG(vacation_hours) as avg_vacation_hours,
                AVG(overtime_hours) as avg_overtime_hours
            FROM employee_data
            GROUP BY industry
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ msg: 'Internal server error', detail: err.message });
    }
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
