import { body, param, validationResult } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";
import mongoose from "mongoose";
import Job from "../models/JobModel.js";
import User from "../models/UserModel.js";

const withValidationErrors = (validateValues) => {
  // array of middlewares is express' thing
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        if (errorMessages[0].startsWith("NO job")) {
          throw new NotFoundError(errorMessages);
        }

        if (errorMessages[0].startsWith("not authorized"))
          throw new UnauthorizedError("not authorized to access this route");

        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

// export const validateTest = withValidationErrors([
//   body("name")
//     .notEmpty()
//     .withMessage("name is required")
//     .isLength({ min: 3, max: 50 })
//     .withMessage("name must be between 3 and 50 chars long")
//     .trim(),
// ]);

export const validateJobInput = withValidationErrors([
  body("company").notEmpty().withMessage("company is required"),
  body("position").notEmpty().withMessage("position is required"),
  body("jobLocation").notEmpty().withMessage("job location is required"),
  body("jobStatus")
    .isIn(Object.values(JOB_STATUS))
    .withMessage("Invalid status value"),
  body("jobType")
    .isIn(Object.values(JOB_TYPE))
    .withMessage("Invalid type value"),
]);

export const validateIdParam = withValidationErrors([
  param("jobId").custom(async (value, { req }) => {
    const isValidJobId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidJobId) throw new BadRequestError("invalid MongoDB id");

    const job = await Job.findById(value);
    if (!job) throw new NotFoundError(`NO job found: ${value}`);
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.userId === job.createdBy.toString();
    if (!isAdmin && !isOwner) {
      throw new UnauthorizedError("not authorized to access this route");
    }
  }),
  // .withMessage("invalid MongoDB id"),
]);

export const validateRegisterInput = withValidationErrors([
  body("name").notEmpty().withMessage("Name is required"),
  body("lastName").notEmpty().withMessage("last name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError("email already exists");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must at least 8 chars long"),
  body("location").notEmpty().withMessage("Location is required"),
]);

export const validateLoginInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
]);

export const validateUpdateUserInput = withValidationErrors([
  body("name").notEmpty().withMessage("Name is required"),
  body("lastName").notEmpty().withMessage("last name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      // checking if email does not clash with someone'e else email
      if (user && user._id.toString() !== req.user.userId) {
        throw new BadRequestError("email already exists");
      }
    }),

  body("location").notEmpty().withMessage("Location is required"),
]);
