import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";

import { getAllContactMessages, getContactMessageById} from "../../controllers/admins/contactus";


const router = Router();


router.get('/contact', catchAsync(getAllContactMessages));
router.get('/contact/:id', catchAsync(getContactMessageById));

export default router;