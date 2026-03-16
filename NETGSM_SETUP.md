# NetGSM SMS Integration Setup Guide

This application uses **NetGSM** for sending SMS notifications to parents when their accounts are created.

## Features

- ✅ Automatic SMS when parent account is created (student registration)
- ✅ Automatic SMS when pre-registration is converted to student
- ✅ Sends temporary password via SMS
- ✅ Turkish phone number validation
- ✅ Graceful fallback (logs to console if not configured)

## Setup Instructions

### 1. Get NetGSM Account

1. Visit [NetGSM](https://www.netgsm.com.tr/)
2. Sign up for an account
3. Get your API credentials:
   - **Usercode** (username)
   - **Password** (API password)
4. Configure a message header (sender name) - e.g., "CAMLIKSPOR"

### 2. Configure Environment Variables

Add the following to your `.env` file:

```env
# NetGSM SMS Configuration
NETGSM_USERCODE=your_netgsm_username
NETGSM_PASSWORD=your_netgsm_password
NETGSM_MSGHEADER=CAMLIKSPOR

# Application URL (for SMS messages)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Production Example:**
```env
NETGSM_USERCODE=8501234567
NETGSM_PASSWORD=your_api_password
NETGSM_MSGHEADER=CAMLIKSPOR
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Phone Number Format

The system automatically handles Turkish phone numbers:

**Accepted formats:**
- `5XXXXXXXXX` ✅ (Preferred)
- `05XXXXXXXXX` ✅ (Leading 0 removed automatically)
- `905XXXXXXXXX` ✅ (Country code removed automatically)
- `+905XXXXXXXXX` ✅ (Cleaned automatically)

**NetGSM expects:** `5XXXXXXXXX` (10 digits, starting with 5)

### 4. SMS Message Template

When a parent account is created, they receive:

```
Veli Paneli giris sifreniz: [PASSWORD] - Ilk girisde sifrenizi degistirin. [APP_URL]/parent-login
```

**Example:**
```
Veli Paneli giris sifreniz: Abc123Xy - Ilk girisde sifrenizi degistirin. https://camlikspor.com/parent-login
```

## Testing

### Without NetGSM Configuration (Development)

If `NETGSM_USERCODE` and `NETGSM_PASSWORD` are not set:
- SMS will **NOT** be sent
- Message will be **logged to console**
- Operation will **NOT** fail (graceful fallback)

Check console output:
```
[SMS - NOT CONFIGURED] To: 5551234567, Message: Veli Paneli giris...
[SMS WARNING] NetGSM credentials not configured. Set NETGSM_USERCODE and NETGSM_PASSWORD in .env
```

### With NetGSM Configuration (Production)

When credentials are configured:
- SMS will be sent via NetGSM API
- Success/failure logged to console

**Success:**
```
[SMS SUCCESS] Sent to 5551234567 via NetGSM
```

**Error:**
```
[SMS ERROR] NetGSM error code 30: Invalid NetGSM credentials
```

## NetGSM API Response Codes

| Code | Meaning |
|------|---------|
| `00` | ✅ Success - SMS sent |
| `20` | ❌ Message text not found |
| `30` | ❌ Invalid user/password |
| `40` | ❌ Invalid message header |
| `50` | ❌ Invalid phone number |
| `51` | ❌ NetGSM system error |
| `70` | ❌ Invalid parameters |
| `85` | ❌ Invalid API key |

## API Endpoint

```
GET https://api.netgsm.com.tr/sms/send/get
```

**Parameters:**
- `usercode`: Your NetGSM username
- `password`: Your NetGSM password
- `gsmno`: Phone number (5XXXXXXXXX format)
- `message`: SMS message text
- `msgheader`: Sender name/header
- `dil`: Language code (TR for Turkish)

## Workflow

### Student Registration
1. Admin creates student with parent email
2. System creates/links parent account
3. If new parent → temporary password generated
4. **SMS sent with credentials** 📱
5. Parent receives SMS and logs in

### Pre-Registration Conversion
1. Admin converts pre-registration to student
2. System creates student record
3. System creates/links parent account
4. If new parent → temporary password generated
5. **SMS sent with credentials** 📱
6. Parent receives SMS and logs in

## Troubleshooting

### SMS Not Sending

**Check:**
1. ✅ Environment variables set correctly
2. ✅ NetGSM account has credits
3. ✅ Phone number is valid Turkish mobile (starts with 5)
4. ✅ Message header approved by NetGSM
5. ✅ API credentials are correct

**Console Logs:**
Check your application logs for error details:
```bash
[SMS ERROR] NetGSM error code XX: [Error description]
```

### Phone Number Errors

If you get `Invalid phone number format`:
- Ensure number starts with `5`
- Number must be exactly 10 digits after cleaning
- Example valid numbers: `5551234567`, `5321234567`

### API Credential Errors

If you get `Invalid NetGSM credentials`:
- Verify `NETGSM_USERCODE` is correct
- Verify `NETGSM_PASSWORD` is the API password (not web login password)
- Contact NetGSM support if credentials don't work

## Documentation Links

- [NetGSM Official Documentation](https://www.netgsm.com.tr/dokuman/)
- [NetGSM API on Postman](https://www.postman.com/netgsmteknikdestek/netgsm/documentation/uyp37cf/netgsm-api)
- [NetGSM GitHub Examples](https://github.com/tarfin-labs/netgsm)

## Cost Considerations

- NetGSM charges per SMS sent
- Check your NetGSM account for pricing
- Monitor SMS usage in NetGSM dashboard
- Consider setting up balance alerts

## Security Best Practices

1. ✅ Keep API credentials in `.env` file (never commit to git)
2. ✅ Use different credentials for dev/staging/production
3. ✅ Rotate API passwords periodically
4. ✅ Monitor SMS logs for unusual activity
5. ✅ Set up IP restrictions in NetGSM panel if available

## Future Enhancements

Potential improvements:
- [ ] Add SMS templates for different notifications
- [ ] Support for bulk SMS sending
- [ ] SMS delivery status tracking
- [ ] Retry logic for failed SMS
- [ ] Queue system for high-volume SMS
- [ ] SMS usage analytics dashboard
- [ ] Notification preferences (SMS on/off)

---

**Need Help?**
- NetGSM Support: Contact via [www.netgsm.com.tr](https://www.netgsm.com.tr/)
- Check application logs for detailed error messages
- Review phone number format requirements
