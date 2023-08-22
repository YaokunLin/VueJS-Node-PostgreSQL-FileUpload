<template>
  <div>
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
   
    <!-- Display Errors -->
    <div v-if="errors.length">
      <h3>Validation Errors:</h3>
      <ul>
        <li v-for="error in errors" :key="error" style="color: red">{{ error }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import Papa from 'papaparse';

export default {
  data() {
    return {
      csvFile: null,
      errors: [],
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

      console.log(file);
      console.log(requiredColumns.every((col) => columns.includes(col)))

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
          formData.append("csv", this.csvFile); 

          fetch(`${apiUrl}/upload`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      // Check if the response status is OK
      if (!response.ok) {
        throw new Error("Server responded with an error");
      }
      return response.json();
    })
    .then((data) => {
      if (data.errors && data.errors.length) {
        this.errors = data.errors; // Populate errors array
        alert("Validation Error uploading CSV. Please try again.");
      } else {
        this.errors = []; // Clear errors
        alert("Successfully uploaded!");
      }
    })
    .catch((error) => {
      console.error("Error uploading CSV:", error);
      if (error && error.detail) {
        alert(`Server Error: ${error.detail}`);
    } else {
        alert("Server Error uploading CSV. Please try again.");
    }
    });
  }
  });
    },
  },
};
</script>
