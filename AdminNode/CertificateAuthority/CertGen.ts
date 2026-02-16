import forge from "node-forge";
import fs from "fs";

try {

  const keys = forge.pki.rsa.generateKeyPair(4096);


  const cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = "01";
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 10);

  const attrs = [{ name: "commonName", value: "SecureNetworkAdminCA" }];
  cert.setSubject(attrs);
  cert.setIssuer(attrs);

  cert.setExtensions([
    { name: "basicConstraints", cA: true },
    { name: "keyUsage", keyCertSign: true, cRLSign: true },
  ]);

  console.log("Signing certificate…");
  cert.sign(keys.privateKey, forge.md.sha256.create());

 
  fs.writeFileSync("admin.key", forge.pki.privateKeyToPem(keys.privateKey));

  console.log("Saving certificate…");
  const pemCert = forge.pki.certificateToPem(cert);
  fs.writeFileSync("admin.crt", pemCert);

  console.log("Admin CA created successfully!");
} catch (err) {
  console.error(" Error during certificate generation:", err);
}