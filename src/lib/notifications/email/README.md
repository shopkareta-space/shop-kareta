# Provider-Agnostic Notification Architecture

This module abstracts email sending away from the core application logic (e.g. checkout, order status updates). It allows Shop Kareta to switch email providers (Resend, SendGrid, Amazon SES, SMTP) instantly without changing any business logic.

## Architecture

```
lib/notifications/email/
├── providers/
│   ├── EmailProvider.interface.ts   # The contract every provider must implement
│   ├── ResendProvider.ts            # Resend implementation
│   ├── MockProvider.ts              # Development/testing implementation
│   └── SmtpProvider.ts              # SMTP stub implementation
├── services/
│   └── NotificationService.ts       # The SINGLE entry point for the application
├── templates/
│   ├── EmailLayout.tsx              # Wrapper with branding
│   └── OrderConfirmationEmail.tsx   # React Email templates...
└── types/
    └── index.ts                     # Shared interfaces
```

## Usage

The application **must never** import `Resend` or any provider directly. Instead, it must call semantic methods on the `NotificationService`.

**Example in Checkout API:**
```typescript
import { notificationService } from "@/lib/notifications/email/services/NotificationService";

await notificationService.sendOrderConfirmation(
  contact.email,
  contact.firstName,
  newOrderId,
  orderNumber,
  totalAmount,
  shippingAddress,
  items
);
```

### Configuration (Environment Variables)

The active provider is determined exclusively by environment variables:

```env
# Set to 'resend', 'smtp', or 'mock'
EMAIL_PROVIDER=resend

# Global Sender Configuration
EMAIL_SENDER_NAME="Shop Kareta"
EMAIL_SENDER_ADDRESS="orders@shopkareta.com"
EMAIL_REPLY_TO="support@shopkareta.com"

# Provider specific keys
RESEND_API_KEY=re_123456789
```

Changing `EMAIL_PROVIDER=smtp` will instantly route all emails through the `SmtpProvider` without touching any application code.

## How to Add a New Provider (e.g. SendGrid)

1. **Create the Provider Class:**
   Create `providers/SendGridProvider.ts` implementing `EmailProvider`:
   ```typescript
   import { EmailProvider } from "./EmailProvider.interface";
   import { EmailPayload, ProviderResponse } from "../types";
   import sgMail from '@sendgrid/mail';

   export class SendGridProvider implements EmailProvider {
     constructor(apiKey: string) {
       sgMail.setApiKey(apiKey);
     }

     async sendEmail(payload: EmailPayload, senderInfo: { from: string }): Promise<ProviderResponse> {
       // Transform payload and call sgMail.send()
     }
     
     async healthCheck() {
       return { ok: true };
     }
   }
   ```

2. **Register the Provider:**
   Open `services/NotificationService.ts` and add it to the `getProviderInstance` switch statement:
   ```typescript
   case 'sendgrid':
     return new SendGridProvider(process.env.SENDGRID_API_KEY || '');
   ```

3. **Update Environment Variable:**
   Set `EMAIL_PROVIDER=sendgrid` in your `.env`.

## How to Create a New Template

1. Create a new `.tsx` file in `templates/` (e.g., `PasswordResetEmail.tsx`).
2. Wrap your content in the `<EmailLayout>` component.
3. Open `NotificationService.ts` and add a new method:
   ```typescript
   public async sendPasswordReset(to: string, resetLink: string) {
     await this.queueEmail({
       to,
       subject: "Reset your password",
       templateName: "PasswordReset",
       react: React.createElement(PasswordResetEmail, { resetLink })
     });
   }
   ```
4. Call `notificationService.sendPasswordReset(...)` from your auth logic.

## Queue & Retry Logic

The `NotificationService` currently implements an in-memory asynchronous background worker with exponential backoff (retrying up to 3 times).
All emails are logged to the `email_logs` Supabase table. 

If this app scales significantly, you can update the `queueEmail` method inside `NotificationService.ts` to push the payload to **BullMQ**, **Inngest**, or **Trigger.dev** instead of processing it in-memory. Because the architecture is decoupled, the rest of the app won't notice the change.
