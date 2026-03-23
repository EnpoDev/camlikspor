import crypto from "crypto";

// Garanti BBVA Sanal POS Configuration
const CONFIG = {
  merchantId: process.env.GARANTI_MERCHANT_ID || "",
  terminalId: process.env.GARANTI_TERMINAL_ID || "",
  provOosPassword: process.env.GARANTI_PROVOOS_PASSWORD || "",
  provRfnPassword: process.env.GARANTI_PROVRFN_PASSWORD || "",
  storeKey: process.env.GARANTI_STORE_KEY || "",
  mode: process.env.GARANTI_MODE || "TEST",
  gatewayUrl:
    process.env.GARANTI_GATEWAY_URL ||
    "https://sanalposprovtest.garantibbva.com.tr/servlet/gt3dengine",
  xmlUrl:
    process.env.GARANTI_XML_URL ||
    "https://sanalposprovtest.garantibbva.com.tr/VPServlet",
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
// SHA512(terminalId + orderId + amount + currencyCode + successUrl + errorUrl + txnType + installmentCount + storeKey + hashedPassword)
export function generateOosHash(params: {
  orderId: string;
  amount: string; // in kuruş, e.g. "10000" for 100 TL
  currencyCode?: string;
  successUrl: string;
  errorUrl: string;
  txnType?: string;
  installmentCount?: string;
}): string {
  const hashedPassword = generateHashedPassword();
  // terminalId in hash MUST match form's terminalid field (padded)
  const hashStr = [
    padTerminalId(CONFIG.terminalId),
    params.orderId,
    params.amount,
    params.currencyCode || "949",
    params.successUrl,
    params.errorUrl,
    params.txnType || "sales",
    params.installmentCount || "",
    CONFIG.storeKey,
    hashedPassword,
  ].join("");

  const result = crypto.createHash("sha512").update(hashStr, "utf8").digest("hex").toUpperCase();

  console.log("[GARANTI HASH DEBUG]", JSON.stringify({
    terminalId: CONFIG.terminalId,
    orderId: params.orderId,
    amount: params.amount,
    currencyCode: params.currencyCode || "949",
    successUrl: params.successUrl,
    errorUrl: params.errorUrl,
    txnType: params.txnType || "sales",
    installmentCount: params.installmentCount || "",
    storeKey: CONFIG.storeKey ? CONFIG.storeKey.substring(0, 5) + "..." : "EMPTY",
    hashedPassword,
    hashInput: hashStr.substring(0, 80) + "...",
    result: result.substring(0, 20) + "...",
  }));

  return result;
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
    currencyCode: "949",
    successUrl: params.successUrl,
    errorUrl: params.errorUrl,
    txnType: "sales",
    installmentCount: "",
  });

  return {
    mode: CONFIG.mode,
    apiversion: "512",
    secure3dsecuritylevel: "OOS_PAY",
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

// Generate hashed password for PROVRFN (refund user)
function generateRefundHashedPassword(): string {
  const data = CONFIG.provRfnPassword + padTerminalId(CONFIG.terminalId);
  return crypto.createHash("sha1").update(data, "utf8").digest("hex").toUpperCase();
}

// Generate hash for XML API (refund/cancel)
// HashData = SHA512(orderId + terminalId + amount + hashedPassword)
function generateXmlHash(orderId: string, amount: string, hashedPassword: string): string {
  const hashStr = orderId + padTerminalId(CONFIG.terminalId) + amount + hashedPassword;
  return crypto.createHash("sha512").update(hashStr, "utf8").digest("hex").toUpperCase();
}

// Send refund request to Garanti BBVA via XML API
export async function sendRefundRequest(params: {
  orderId: string;
  amount: number; // in TL
  customerIp?: string;
}): Promise<{ success: boolean; message: string; rawResponse?: string }> {
  const amountStr = amountToKurus(params.amount);
  const hashedPassword = generateRefundHashedPassword();
  const hashData = generateXmlHash(params.orderId, amountStr, hashedPassword);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<GVPSRequest>
  <Mode>${CONFIG.mode}</Mode>
  <Version>v0.01</Version>
  <Terminal>
    <ProvUserID>PROVRFN</ProvUserID>
    <HashData>${hashData}</HashData>
    <UserID>PROVRFN</UserID>
    <ID>${padTerminalId(CONFIG.terminalId)}</ID>
    <MerchantID>${CONFIG.merchantId}</MerchantID>
  </Terminal>
  <Customer>
    <IPAddress>${params.customerIp || "127.0.0.1"}</IPAddress>
    <EmailAddress></EmailAddress>
  </Customer>
  <Order>
    <OrderID>${params.orderId}</OrderID>
  </Order>
  <Transaction>
    <Type>refund</Type>
    <InstallmentCnt></InstallmentCnt>
    <Amount>${amountStr}</Amount>
    <CurrencyCode>949</CurrencyCode>
    <CardholderPresentCode>0</CardholderPresentCode>
    <MotoInd>N</MotoInd>
  </Transaction>
</GVPSRequest>`;

  try {
    const response = await fetch(CONFIG.xmlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xml,
    });

    const responseText = await response.text();
    console.log(`[GARANTI REFUND] orderId=${params.orderId} response=${responseText.substring(0, 500)}`);

    // Parse response - look for ReasonCode and Message
    const reasonCodeMatch = responseText.match(/<ReasonCode>(\d+)<\/ReasonCode>/);
    const messageMatch = responseText.match(/<Message>([^<]*)<\/Message>/);
    const errorMsgMatch = responseText.match(/<ErrorMsg>([^<]*)<\/ErrorMsg>/);
    const reasonCode = reasonCodeMatch?.[1] || "";
    const message = messageMatch?.[1] || "";
    const errorMsg = errorMsgMatch?.[1] || "";

    if (reasonCode === "00" || message === "Approved") {
      return { success: true, message: "Iade basariyla tamamlandi", rawResponse: responseText };
    }

    return {
      success: false,
      message: errorMsg || message || `Iade basarisiz (Kod: ${reasonCode})`,
      rawResponse: responseText,
    };
  } catch (error) {
    console.error("[GARANTI REFUND] Error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Iade istegi gonderilemedi",
    };
  }
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
