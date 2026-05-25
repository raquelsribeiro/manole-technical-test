import { AppDataSource } from "./config/data-source";
import { app } from "./app";

const PORT = process.env.PORT || 3333;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
