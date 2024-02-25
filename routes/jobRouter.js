import { Router } from "express";
import {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
  getJob,
} from "../controllers/jobController.js";
import {
  validateIdParam,
  validateJobInput,
} from "../middleware/validationMiddleware.js";

const router = Router();

// router.get("/", getAllJobs);
router.route("/").get(getAllJobs).post(validateJobInput, createJob);
router
  .route("/:jobId")
  .get(validateIdParam, getJob)
  .patch(validateJobInput, validateIdParam, updateJob)
  .delete(validateIdParam, deleteJob);

export default router;
