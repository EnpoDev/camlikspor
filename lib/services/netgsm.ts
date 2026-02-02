/**
 * NetGSM SMS Service
 * Documentation: https://www.netgsm.com.tr/dokuman/
 */

export interface NetGsmResponse {
  success: boolean;
  jobId?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface NetGsmBalanceResponse {
  success: boolean;
  balance?: number;
  errorMessage?: string;
}

export interface SendSmsParams {
  recipients: string[];
  message: string;
  title?: string;
}

const NETGSM_API_URL = "https://api.netgsm.com.tr";

// NetGSM error codes
const ERROR_MESSAGES: Record<string, string> = {
  "20": "Mesaj metninde problem var",
  "30": "Geçersiz kullanıcı adı veya şifre",
  "40": "Mesaj başlığı sisteminizde tanımlı değil",
  "50": "Abone hesabı aktif değil",
  "51": "Hesapta yeterli kredi yok",
  "70": "Hatalı sorgulama",
  "80": "Gönderim tarihi hatalı",
  "85": "Belirlenen zaman aralığına ulaşıldı",
};

function normalizePhoneNumber(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, "");

  // Handle Turkish phone numbers
  if (cleaned.startsWith("0")) {
    cleaned = "90" + cleaned.slice(1);
  } else if (!cleaned.startsWith("90")) {
    cleaned = "90" + cleaned;
  }

  return cleaned;
}

/**
 * Send SMS via NetGSM API
 */
export async function sendSms(params: SendSmsParams): Promise<NetGsmResponse> {
  const userCode = process.env.NETGSM_USER_CODE;
  const secret = process.env.NETGSM_SECRET;
  const msgHeader = process.env.NETGSM_MSGHEADER;

  if (!userCode || !secret || !msgHeader) {
    return {
      success: false,
      errorCode: "CONFIG_ERROR",
      errorMessage: "NetGSM yapılandırması eksik. Lütfen sistem yöneticisiyle iletişime geçin.",
    };
  }

  if (params.recipients.length === 0) {
    return {
      success: false,
      errorCode: "NO_RECIPIENTS",
      errorMessage: "En az bir alıcı gerekli",
    };
  }

  // Normalize phone numbers
  const normalizedRecipients = params.recipients.map(normalizePhoneNumber);
  const recipientList = normalizedRecipients.join(",");

  // Build XML request for bulk SMS
  const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
<mainbody>
  <header>
    <company dession="1">Netgsm</company>
    <usercode>${userCode}</usercode>
    <password>${secret}</password>
    <type>1:n</type>
    <msgheader>${params.title || msgHeader}</msgheader>
  </header>
  <body>
    <msg><![CDATA[${params.message}]]></msg>
    <no>${recipientList}</no>
  </body>
</mainbody>`;

  try {
    const response = await fetch(`${NETGSM_API_URL}/sms/send/xml`, {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
      },
      body: xmlData,
    });

    const responseText = await response.text();

    // Parse NetGSM response
    // Success format: 00 JOBID
    // Error format: ERROR_CODE
    const parts = responseText.trim().split(" ");
    const code = parts[0];

    if (code === "00" || code === "01" || code === "02") {
      return {
        success: true,
        jobId: parts[1] || undefined,
      };
    }

    return {
      success: false,
      errorCode: code,
      errorMessage: ERROR_MESSAGES[code] || `NetGSM hatası: ${code}`,
    };
  } catch (error) {
    console.error("NetGSM API error:", error);
    return {
      success: false,
      errorCode: "NETWORK_ERROR",
      errorMessage: "SMS servisiyle bağlantı kurulamadı",
    };
  }
}

/**
 * Get SMS balance from NetGSM
 */
export async function getSmsBalance(): Promise<NetGsmBalanceResponse> {
  const userCode = process.env.NETGSM_USER_CODE;
  const secret = process.env.NETGSM_SECRET;

  if (!userCode || !secret) {
    return {
      success: false,
      errorMessage: "NetGSM yapılandırması eksik",
    };
  }

  try {
    const response = await fetch(
      `${NETGSM_API_URL}/balance/list/get?usercode=${encodeURIComponent(userCode)}&password=${encodeURIComponent(secret)}&stession=1`,
      { method: "GET" }
    );

    const responseText = await response.text();

    // Parse balance response
    // Success format: BALANCE (number)
    // Error format: ERROR_CODE
    const balance = parseFloat(responseText.trim());

    if (!isNaN(balance)) {
      return {
        success: true,
        balance: Math.floor(balance),
      };
    }

    return {
      success: false,
      errorMessage: ERROR_MESSAGES[responseText.trim()] || "Bakiye sorgulanamadı",
    };
  } catch (error) {
    console.error("NetGSM balance check error:", error);
    return {
      success: false,
      errorMessage: "SMS servisiyle bağlantı kurulamadı",
    };
  }
}

/**
 * Check SMS delivery status
 */
export async function checkSmsStatus(jobId: string): Promise<{
  success: boolean;
  delivered?: number;
  pending?: number;
  failed?: number;
  errorMessage?: string;
}> {
  const userCode = process.env.NETGSM_USER_CODE;
  const secret = process.env.NETGSM_SECRET;

  if (!userCode || !secret) {
    return {
      success: false,
      errorMessage: "NetGSM yapılandırması eksik",
    };
  }

  try {
    const response = await fetch(
      `${NETGSM_API_URL}/sms/report?usercode=${encodeURIComponent(userCode)}&password=${encodeURIComponent(secret)}&bulkid=${jobId}&type=0`,
      { method: "GET" }
    );

    const responseText = await response.text();

    // Parse response - format varies based on status
    // This is a simplified implementation
    if (responseText.includes("Hata")) {
      return {
        success: false,
        errorMessage: "Durum sorgulanamadı",
      };
    }

    return {
      success: true,
      delivered: 0,
      pending: 0,
      failed: 0,
    };
  } catch (error) {
    console.error("NetGSM status check error:", error);
    return {
      success: false,
      errorMessage: "Durum sorgulanamadı",
    };
  }
}
