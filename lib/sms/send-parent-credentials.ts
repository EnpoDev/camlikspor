/**
 * Sends parent login credentials via NetGSM SMS API
 * NetGSM API Documentation: https://www.netgsm.com.tr/dokuman/
 */
export async function sendParentCredentialsSMS(
  phone: string,
  temporaryPassword: string
): Promise<{ success: boolean; error?: string }> {
  const message = `Veli Paneli giris sifreniz: ${temporaryPassword} - Ilk girisde sifrenizi degistirin. ${process.env.NEXT_PUBLIC_APP_URL}/parent-login`;

  // NetGSM credentials from environment
  const usercode = process.env.NETGSM_USERCODE;
  const password = process.env.NETGSM_PASSWORD;
  const msgheader = process.env.NETGSM_MSGHEADER || "CAMLIKSPOR";

  // If NetGSM is not configured, log to console and return success
  if (!usercode || !password) {
    console.log(`[SMS - NOT CONFIGURED] To: ${phone}, Message: ${message}`);
    console.warn("[SMS WARNING] NetGSM credentials not configured. Set NETGSM_USERCODE and NETGSM_PASSWORD in .env");
    return { success: true }; // Don't fail if SMS not configured
  }

  try {
    // Clean phone number - NetGSM expects format: 5XXXXXXXXX (without +90)
    const cleanPhone = phone
      .replace(/\D/g, "") // Remove non-digits
      .replace(/^90/, "") // Remove country code if present
      .replace(/^0/, ""); // Remove leading 0 if present

    if (!cleanPhone.startsWith("5") || cleanPhone.length !== 10) {
      console.error(`[SMS ERROR] Invalid Turkish phone number format: ${phone}`);
      return {
        success: false,
        error: `Invalid phone number format: ${phone}. Expected: 5XXXXXXXXX`
      };
    }

    // NetGSM API endpoint
    const url = "https://api.netgsm.com.tr/sms/send/get";

    // Build query parameters
    const params = new URLSearchParams({
      usercode: usercode,
      password: password,
      gsmno: cleanPhone,
      message: message,
      msgheader: msgheader,
      dil: "TR", // Turkish language
    });

    // Send SMS via NetGSM API
    const response = await fetch(`${url}?${params.toString()}`, {
      method: "GET",
    });

    const responseText = await response.text();

    // NetGSM Response Codes:
    // 00 => Success
    // 20 => Message text not found
    // 30 => Invalid user/password
    // 40 => Invalid header (msgheader)
    // 50 => Invalid phone number
    // 51 => System error
    // 70 => Invalid parameters
    // 85 => Invalid API key

    if (responseText.startsWith("00")) {
      console.log(`[SMS SUCCESS] Sent to ${phone} via NetGSM`);
      return { success: true };
    } else {
      const errorMessages: Record<string, string> = {
        "20": "Message text not found",
        "30": "Invalid NetGSM credentials",
        "40": "Invalid message header",
        "50": "Invalid phone number",
        "51": "NetGSM system error",
        "70": "Invalid parameters",
        "85": "Invalid API key",
      };

      const errorCode = responseText.substring(0, 2);
      const errorMsg = errorMessages[errorCode] || `Unknown error: ${responseText}`;

      console.error(`[SMS ERROR] NetGSM error code ${errorCode}: ${errorMsg}`);
      return {
        success: false,
        error: `NetGSM error: ${errorMsg}`
      };
    }
  } catch (error) {
    console.error("[SMS ERROR]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
