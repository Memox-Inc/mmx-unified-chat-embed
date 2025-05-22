// utils/wsAuth.js
import crypto from 'crypto';

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET!;

export function generateSecureWsParams(org_id: string) {
    // Simple base64 encoding of org_id (not secure by itself)
    const hashedOrgId = Buffer.from(org_id?.toString()).toString('base64');
    // const timestamp = Date.now().toString();

    // Create HMAC hash
    const hash = crypto.createHmac('sha256', "4f3c9a1d8e5b6c2f719a0e3d5a8b7c4d9e6f1a0b3d7c8e2f6a9d0e1b4c5f7a6d")
        .update(hashedOrgId)
        .digest('hex');

    return {
        hashed_org_id: hashedOrgId,
        hash: hash
    };
}