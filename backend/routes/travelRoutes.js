import {
    deleteHolidayDates, getDayCountForUser,
    getHolidayDates,
    getReportData,
    getTravelData,
    saveHolidayDates,
    updateTravelStatus
} from "../controllers/travelController.js";
import express from "express";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

//Validate Authorization
router.use(requireAuth);

router.post("/getTravelData", getTravelData);
router.post("/updateTravelStatus", updateTravelStatus);

router.post("/getReportData", getReportData);
router.post("/getDayCountForUser", getDayCountForUser);

router.get("/holidays", getHolidayDates)
router.post("/holidays", saveHolidayDates)
router.delete("/holidays/:id", deleteHolidayDates)

export default router
