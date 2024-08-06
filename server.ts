import mongoose from "mongoose";
import app from "./app";

const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.DATABASE_URL as string)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
