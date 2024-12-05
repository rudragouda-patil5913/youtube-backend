import {Router} from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middlewares.js";
import {verifyJWT} from "../middlewares/authentication.middlewares"

const router = Router();


router.route("/login").post(loginUser)

router.route("/register").post(
    upload.fields([{
        name:"avatar",
        maxCount: 1
    },{
         name:"coverImage",
        maxCount: 1
    }])
    ,registerUser);

route.route("/logout").post(verifyJWT,logoutUser)

export default router;


