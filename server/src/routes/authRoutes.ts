import { Router } from "express";
import {
  login,
  logout,
  refreshAccessToken,
  register,
} from "../controllers/authController";
import { validateData } from "../middlewares/validationMiddleware";
import { userLoginSchema, userRegistrationSchema } from "../schemas/userSchema";

const router = Router();

router.post("/register", validateData(userRegistrationSchema), register);
router.post("/login", validateData(userLoginSchema), login);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logout);

export default router;
