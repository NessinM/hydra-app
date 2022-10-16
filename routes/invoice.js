import { Router } from "express";
const router = Router();

// import mw    from '../model/middleware';
import invoice from '../models/invoice.js';

router.get('/', invoice.renderDocumentOfHash)
router.get('/search', invoice.getInvoiceSAP)
router.get('/status/sunat', invoice.getStatusInvoiceSunat)

export default router