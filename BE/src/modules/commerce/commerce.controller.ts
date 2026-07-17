import { NextFunction, Request, Response } from "express";
import { success } from "../../utils/response";
import commerceService from "./commerce.service";

class CommerceController {
    async products(_req: Request, res: Response, next: NextFunction) { try { return success(res, await commerceService.listProducts()); } catch (e) { next(e); } }
    async createOrder(req: Request, res: Response, next: NextFunction) { try { if (!req.user) return res.status(401).json({ success: false }); return success(res, await commerceService.createOrder(req.user.id, req.body.productId, req.body.quantity), "Quote created."); } catch (e) { next(e); } }
    async submitPayment(req: Request, res: Response, next: NextFunction) { try { if (!req.user) return res.status(401).json({ success: false }); return success(res, await commerceService.submitPayment(req.user.id, String(req.params.id), req.body.intentId, req.body.txHash), "Payment submitted for verification."); } catch (e) { next(e); } }
    async orders(req: Request, res: Response, next: NextFunction) { try { if (!req.user) return res.status(401).json({ success: false }); return success(res, await commerceService.listOrders(req.user.id)); } catch (e) { next(e); } }
}
export default new CommerceController();
