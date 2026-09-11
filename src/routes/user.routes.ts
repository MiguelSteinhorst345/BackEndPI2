import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { auth } from "../middlewares/auth";

const router = Router();
router.get(
    "/profile",
    auth,
    UserController.profile
);
router.put(
    "/profile",
    auth,
    UserController.updateProfile
);
router.put(
    "/password",
    auth,
    UserController.updatePassword
);
router.patch(
    "/dark-mode",
    auth,
    UserController.updateDarkMode
);
export default router;