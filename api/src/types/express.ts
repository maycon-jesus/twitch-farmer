import { IJWTPayload } from '../controllers/Auth';

declare global {
    namespace Express {
        interface Request {
            jwt: IJWTPayload;
        }
    }
}
