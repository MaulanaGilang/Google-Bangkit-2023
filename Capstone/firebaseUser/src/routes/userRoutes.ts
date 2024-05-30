import express, { Request, Response } from "express";
import { registerUser } from "../controllers/registerController";
import { updateUser } from "../controllers/registerController";
import { loginUser } from "../controllers/loginController";
import { searchedByUser } from "../controllers/getallwisataController";
import { getAllWisata} from "../controllers/getallwisataController";
import { getEditorialSummary } from "../controllers/getallwisataController";
import { wisataJawa } from "../controllers/pulauController";
import { listPulau } from "../controllers/pulauController";
import { getPopularTouristAttractions } from "../controllers/pulauController";

const router = express.Router();

router.post("/search", searchedByUser);
router.post("/register", registerUser);
router.post("/update", updateUser);
router.post("/login", loginUser);
router.get("/get", getAllWisata);
router.get("/overview", getEditorialSummary);
router.get("/location/:island", wisataJawa);
router.get("/list", listPulau);
router.get("/popular", getPopularTouristAttractions);

export default router;
