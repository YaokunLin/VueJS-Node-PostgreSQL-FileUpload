<template>
  <div>
    <h2>Enter Data</h2>
    <p>
      Please upload a CSV file from your local machine. Ensure that the CSV file includes the following columns:
    </p>
    <ul>
      <li>Employee ID</li>
      <li>Company</li>
      <li>Industry</li>
      <li>Work Hours</li>
      <li>Vacation Hours</li>
    </ul>
    <input type="file" accept=".csv" @change="handleFileUpload" />
    <button @click="submitCSV">Upload</button>
  </div>
</template>

<script>
import Papa from 'papaparse';

export default {
  data() {
    return {
      csvFile: null,
    };
  },
  methods: {
    handleFileUpload(event) {
      console.log("File selected:", event.target.files[0]);
      this.csvFile = event.target.files[0];
    },
    validateCSV(file) {
      if (!file || !file.data || !file.data[0]) return false;
      const columns = file.data[0];

      const requiredColumns = [
        "Employee_ID",
        "Company",
        "Industry",
        "Work Hours",
        "Vacation Hours",
      ];

      console.log(columns);

      return requiredColumns.every((col) => columns.includes(col));
    },
    submitCSV() {
      if (!this.csvFile) return;

      if (this.csvFile.type !== "text/csv") {
        console.error("This is not a csv file");
        return;
      }

      Papa.parse(this.csvFile, {
        complete: (results) => {
          if (!this.validateCSV(results)) {
            alert("Invalid CSV format. Please ensure you have the required columns.");
            return;
          }

          const apiUrl = import.meta.env.VITE_API_HOST || "http://localhost:8080";

          const formData = new FormData();
          formData.append("file", this.csvFile);  // Use 'file' instead of 'csv'

          fetch(`${apiUrl}/upload`, {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              alert("Successfully uploaded!");
            })
            .catch((error) => {
              console.error("Error uploading CSV:", error);
              alert("Error uploading CSV. Please try again.");
            });
        },
      });
    },
  },
};
</script>
