// utils/wsAuth.js
import crypto from 'crypto';

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET!;

export function generateSecureWsParams(org_id: string) {
    // Simple base64 encoding of org_id (not secure by itself)
    const hashedOrgId = Buffer.from(org_id.toString()).toString('base64');
    // const timestamp = Date.now().toString();

    // Create HMAC hash
    const hash = crypto.createHmac('sha256', SECRET_KEY)
        .update(hashedOrgId)
        .digest('hex');

    return {
        hashed_org_id: hashedOrgId,
        hash: hash
    };
}