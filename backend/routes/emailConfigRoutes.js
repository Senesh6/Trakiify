import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import {getEmailConfigurations, updateEmailConfig} from "../controllers/emailConfigController.js";

const router = express.Router();

//Validate Authorization
router.use(requireAuth);

router.get("/configs", getEmailConfigurations);
// router.post("/configs", createEmailConfig);
router.put("/configs/:code", updateEmailConfig);

export default router
