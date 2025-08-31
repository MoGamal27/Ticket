import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";

import { getAllTourHome}  from "../../controllers/admins/tourHome";


import { authenticated } from "../../middlewares/authenticated";
import { hasPrivilege } from "../../middlewares/hasPrivilege";

const router = Router();
router.use(authenticated)


router.route("/")
  .get( catchAsync(getAllTourHome))


  export default router;