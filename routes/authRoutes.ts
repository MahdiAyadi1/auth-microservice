import { Router } from "express";
import {
  register,
  login,
  validateToken,
  refreshToken,
} from "../controllers/authController";
import { validateToken as validateTokenMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/validate-token", validateTokenMiddleware, validateToken);
router.post("/refresh-token", refreshToken);

export default router;
