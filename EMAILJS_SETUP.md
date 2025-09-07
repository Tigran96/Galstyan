# EmailJS Setup Guide

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service

1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. **Copy the Service ID** (e.g., `service_abc123`)

## Step 3: Create Email Template

1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template:

```
Subject: New Enrollment: {{from_name}} - {{plan_type}} {{lessons_per_week}} lessons/week

From: {{from_name}} <{{from_email}}>
Phone: {{phone}}
Subject: {{subject}}
Study Language: {{study_language}}

Plan Details:
- Type: {{plan_type}}
- Lessons per week: {{lessons_per_week}}
- Lessons per month: {{lessons_per_month}}
- Price: {{formatted_price}} ({{price_amd}} AMD / ${{price_usd}} USD / ₽{{price_rub}} RUB)

Enrollment Date: {{enrollment_date}} at {{enrollment_time}}
Page Language: {{page_language}}

Additional Message:
{{message}}

---
{{detailed_message}}
```

4. **Copy the Template ID** (e.g., `template_xyz789`)

## Step 4: Get Public Key

1. Go to **Account** → **General**
2. **Copy your Public Key** (e.g., `user_abcdef123456`)

## Step 5: Update Configuration

Edit `src/services/emailService.js` and replace:

```javascript
const SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your service ID
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with your template ID  
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your public key
```

With your actual IDs:

```javascript
const SERVICE_ID = 'service_abc123'; // Your actual service ID
const TEMPLATE_ID = 'template_xyz789'; // Your actual template ID
const PUBLIC_KEY = 'user_abcdef123456'; // Your actual public key
```

## Step 6: Test

1. Save the file
2. Fill out the enrollment form
3. Check your email!

## Free Plan Limits

- **200 emails/month** (free)
- **2 email services** (free)
- **2 email templates** (free)

## Troubleshooting

If emails don't arrive:
1. Check spam folder
2. Verify service is active in EmailJS dashboard
3. Check browser console for errors
4. Make sure all IDs are correct

## Alternative: Formspree

If you prefer Formspree:
1. Go to [formspree.io](https://formspree.io)
2. Create account and form
3. Replace EmailJS code with Formspree code in `EnrollPage.jsx`
