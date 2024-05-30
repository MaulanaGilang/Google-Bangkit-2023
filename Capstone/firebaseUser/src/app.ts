import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import 'dotenv/config'
import userRoutes from "./routes/userRoutes";
import { getData } from "./controllers/dataController";
import './config/firebase'

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/users", userRoutes);
//app.use("/wisata", wisataRoutes); // Add this line to handle routes for retrieving wisata
app.get("/data", getData);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
