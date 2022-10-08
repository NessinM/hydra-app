import { Router } from "express";
const router = Router();

// import mw    from '../model/middleware';
import invoice from '../models/invoice.js';

router.get('/', invoice.getInvoice)

export default router