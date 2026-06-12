import "dotenv/config";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";

connectDB().then(() => {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});
