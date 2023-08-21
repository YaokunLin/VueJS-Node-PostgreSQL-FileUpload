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
export default {
  methods: {
    handleFileUpload(event) {
      // TODO: Implement the file handling logic here
      console.log("File selected:", event.target.files[0]);
    },
    submitCSV() {
      // TODO: Implement the API call to the backend to submit the CSV
      console.log("Submitting CSV to the backend...");
    },
  },
};
</script>
