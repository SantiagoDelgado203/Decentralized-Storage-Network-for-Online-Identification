import crypto from "crypto";

export function decryptData(encryptedBase64: string, key: Buffer): string {
    const data = Buffer.from(encryptedBase64, "base64");

    const nonceSize = 12;  
    const tagSize = 16;     

    if (data.length < nonceSize + tagSize) {
        throw new Error("Ciphertext too short");
    }


    const nonce = data.subarray(0, nonceSize);
    const authTag = data.subarray(data.length - tagSize);
    const ciphertext = data.subarray(nonceSize, data.length - tagSize);

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, nonce);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final()
    ]);

    return decrypted.toString("utf8");
}

export function encryptData(plaintext: string, key: Buffer): string {
    // AES-GCM needs a 12-byte nonce
    const nonce = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv("aes-256-gcm", key, nonce);

    const encrypted = Buffer.concat([
        cipher.update(plaintext, "utf8"),
        cipher.final()
    ]);

    const authTag = cipher.getAuthTag();

    // Match Go's: nonce || ciphertext || tag
    const output = Buffer.concat([nonce, encrypted, authTag]);

    return output.toString("base64");
}