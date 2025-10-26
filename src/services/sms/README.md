# SMS Service

Professional SMS service using Twilio with event-driven architecture, following the same pattern as the email service.

## Features

- ✅ Event-driven SMS sending using NestJS EventEmitter
- ✅ Twilio integration for reliable SMS delivery
- ✅ Automatic OTP SMS on phone signup
- ✅ Separate listeners for different SMS types
- ✅ Professional error handling and logging
- ✅ No templates needed (plain text SMS)

## Architecture

```
Event Emitter → SMS Listener → Twilio API → User's Phone
```

### Components

1. **SmsService** - Core Twilio integration service
2. **SmsEventService** - Event emission service
3. **SmsEventListener** - Event listeners for different SMS types
4. **SMS Events** - Type-safe event classes

## Configuration

Add these to your `.env` file:

```env
# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_FROM_NUMBER=+1234567890
```

## Usage

### Sending Signup OTP SMS

Automatically triggered when user calls `/api/auth/signup-phone`:

```typescript
// In auth.service.ts
await this.smsEventService.emitSignUpOtpSms(phoneNumber, otpCode);
```

### Sending Forgot Password OTP SMS

```typescript
await this.smsEventService.emitForgotPasswordOtpSms(phoneNumber, otpCode);
```

## SMS Types

1. **Signup OTP** - Sent when user signs up with phone
2. **Forgot Password OTP** - Sent for password reset

## Message Format

Default message:
```
Your PeppCruise verification code is: 123456. Valid for 10 minutes.
```

## Error Handling

- Graceful degradation if Twilio not configured
- Detailed logging for debugging
- Automatic retry handling by Twilio

## Best Practices

1. ✅ Never expose OTP in API responses
2. ✅ OTP valid for 10 minutes
3. ✅ Rate limiting on OTP generation
4. ✅ Secure credential storage via `.env`
5. ✅ Event-driven for loose coupling

