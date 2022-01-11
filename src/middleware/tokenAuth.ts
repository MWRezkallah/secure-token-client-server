import { Request, Response, NextFunction } from "express";
import { join } from "path";
import { readFileSync } from "fs";
import { verify, publicDecrypt } from "crypto";

export const tokenAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cipher, signature } = req.body.token;
    const publicKey = readPublicKey();
    const isVerified = verifySecret(cipher, publicKey, signature);
    if (!isVerified)
      res.status(403).send({ status: "Error", message: "Non authorized!" });
    const secret = decryptSecret(cipher, publicKey);
    const appSecret = process.env.appSecret || "Ide7k";
    if (secret !== appSecret)
      res.status(403).send({ status: "Error", message: "Not Authorized!" });
    next();
  } catch (error: any) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

function readPublicKey(keyPath = "keys") {
  const keysPath = join(process.cwd(), keyPath);
  const publicKey = readFileSync(join(keysPath, "pub.key")).toString();
  return publicKey;
}

function verifySecret(
  secret: string,
  publickey: string,
  signature: string
): boolean {
  const data = Buffer.from(secret, "base64");
  const signatureBuff = Buffer.from(signature, "base64");
  return verify("SHA256", data, publickey, signatureBuff);
}

function decryptSecret(encryptedSecret: string, publicKey: string): string {
  const decipheredText = publicDecrypt(
    publicKey,
    Buffer.from(encryptedSecret, "base64")
  ).toString();
  return decipheredText;
}
