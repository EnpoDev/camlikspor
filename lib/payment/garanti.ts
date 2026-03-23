import crypto from "crypto";

// Garanti BBVA Sanal POS Configuration
const CONFIG = {
  merchantId: process.env.GARANTI_MERCHANT_ID || "",
  terminalId: process.env.GARANTI_TERMINAL_ID || "",
  provOosPassword: process.env.GARANTI_PROVOOS_PASSWORD || "",
  storeKey: process.env.GARANTI_STORE_KEY || "",
  mode: process.env.GARANTI_MODE || "TEST",
  gatewayUrl:
    process.env.GARANTI_GATEWAY_URL ||
    "https://sanalposprovtest.garantibbva.com.tr/servlet/gt3dengine",
};

// Pad terminal ID to 9 digits
function padTerminalId(terminalId: string): string {
  return terminalId.padStart(9, "0");
}

// Generate hashed password: SHA1(password + paddedTerminalId) → uppercase
function generateHashedPassword(): string {
  const data = CONFIG.provOosPassword + padTerminalId(CONFIG.terminalId);
  return crypto.createHash("sha1").update(data, "utf8").digest("hex").toUpperCase();
}

// Generate security hash for OOS form
// SHA512(terminalId + orderId + amount + successUrl + errorUrl + txnType + installmentCount + storeKey + hashedPassword)
export function generateOosHash(params: {
  orderId: string;
  amount: string; // in kuruş, e.g. "10000" for 100 TL
  successUrl: string;
  errorUrl: string;
  txnType?: string;
  installmentCount?: string;
}): string {
  const hashedPassword = generateHashedPassword();
  const hashStr = [
    CONFIG.terminalId,
    params.orderId,
    params.amount,
    params.successUrl,
    params.errorUrl,
    params.txnType || "sales",
    params.installmentCount || "",
    CONFIG.storeKey,
    hashedPassword,
  ].join("");

  return crypto.createHash("sha512").update(hashStr, "utf8").digest("hex").toUpperCase();
}

// Verify response hash from Garanti callback
// hashparams contains the field names separated by ":"
export function verifyResponseHash(formData: Record<string, string>): boolean {
  const hashparams = formData["hashparams"] || "";
  const responseHash = formData["hash"] || "";

  if (!hashparams || !responseHash) return false;

  const params = hashparams.split(":").filter(Boolean);
  const hashStr = params.map((param) => formData[param] || "").join("") + CONFIG.storeKey;
  const calculatedHash = crypto.createHash("sha512").update(hashStr, "utf8").digest("hex").toUpperCase();

  return calculatedHash === responseHash.toUpperCase();
}

// Convert TL amount to kuruş string (e.g. 100.50 → "10050")
export function amountToKurus(amount: number): string {
  return Math.round(amount * 100).toString();
}

// Build form fields for Garanti OOS payment
export function buildOosFormFields(params: {
  orderId: string;
  amount: number; // in TL
  customerEmail: string;
  customerIp: string;
  successUrl: string;
  errorUrl: string;
}): Record<string, string> {
  const amountStr = amountToKurus(params.amount);

  const hash = generateOosHash({
    orderId: params.orderId,
    amount: amountStr,
    successUrl: params.successUrl,
    errorUrl: params.errorUrl,
    txnType: "sales",
    installmentCount: "",
  });

  return {
    mode: CONFIG.mode,
    apiversion: "512",
    secure3dsecuritylevel: "3D_OOS_PAY",
    terminalid: padTerminalId(CONFIG.terminalId),
    terminalmerchantid: CONFIG.merchantId,
    terminaluserid: "PROVOOS",
    terminalprovuserid: "PROVAUT",
    txntype: "sales",
    txnamount: amountStr,
    txncurrencycode: "949", // TRY
    txninstallmentcount: "", // tek çekim
    orderid: params.orderId,
    successurl: params.successUrl,
    errorurl: params.errorUrl,
    customeremailaddress: params.customerEmail,
    customeripaddress: params.customerIp,
    secure3dhash: hash,
    lang: "tr",
    refreshtime: "5",
    companyname: "CAMLIK SK",
  };
}

export function getGatewayUrl(): string {
  return CONFIG.gatewayUrl;
}

// Check if payment response is successful
export function isPaymentSuccessful(formData: Record<string, string>): boolean {
  const mdstatus = formData["mdstatus"];
  const procreturncode = formData["procreturncode"];
  const response = formData["response"];

  // mdstatus: 1 = successful 3D auth
  // procreturncode: "00" = successful transaction
  // response: "Approved"
  return (
    mdstatus === "1" &&
    procreturncode === "00" &&
    response === "Approved"
  );
}
