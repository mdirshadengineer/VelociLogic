import "server-only";
import crypto from "crypto";

const encALG = "aes-256-cbc"; // Encryption algorithm name

/**
 * Encrypts a string using AES-256-CBC symmetric encryption.
 * @param data - The plaintext string to encrypt
 * @returns The IV and encrypted data, joined by a colon
 */
export function symmetricEncrypt(data: string): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("Encryption key not found");
  }
  // Initialization vector ensures unique encryption for the same data
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(encALG, Buffer.from(key, "hex"), iv);
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

/**
 * Decrypts a string encrypted with symmetricEncrypt.
 * @param encrypted - The IV and encrypted data, joined by a colon
 * @returns The decrypted plaintext string
 */
export function symmetricDecrypt(encrypted: string): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("Encryption key not found");
  }
  const textParts = encrypted.split(":");
  const iv = Buffer.from(textParts.shift() as string, "hex");
  const encryptedText = Buffer.from(textParts.join(":") as string, "hex");
  const decipher = crypto.createDecipheriv(encALG, Buffer.from(key, "hex"), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
