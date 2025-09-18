import express from "express";

const app = express();

// Simple route
app.get("/", (req, res) => {
  res.send("Server is running on port 8080 🚀");
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
