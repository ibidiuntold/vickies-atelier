# Google Sheets API Setup Guide for Vickie's Atelier

This guide will walk you through setting up Google Sheets API integration for your Vickie's Atelier website. The application uses Google Sheets to store enquiries, orders, and configuration data.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Create a Google Cloud Project](#step-1-create-a-google-cloud-project)
3. [Step 2: Enable Google Sheets API](#step-2-enable-google-sheets-api)
4. [Step 3: Create a Service Account](#step-3-create-a-service-account)
5. [Step 4: Create and Download Service Account Key](#step-4-create-and-download-service-account-key)
6. [Step 5: Create Your Google Spreadsheet](#step-5-create-your-google-spreadsheet)
7. [Step 6: Share Spreadsheet with Service Account](#step-6-share-spreadsheet-with-service-account)
8. [Step 7: Configure Environment Variables](#step-7-configure-environment-variables)
9. [Step 8: Test the Integration](#step-8-test-the-integration)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- A Google account
- Access to [Google Cloud Console](https://console.cloud.google.com/)
- Your Vickie's Atelier project running locally

---

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click **"New Project"**
4. Enter project name: `vickies-atelier` (or your preferred name)
5. Click **"Create"**
6. Wait for the project to be created (you'll see a notification)
7. Select your new project from the project dropdown

---

## Step 2: Enable Google Sheets API

1. In your Google Cloud Console, make sure your project is selected
2. Click on the **hamburger menu** (☰) in the top-left corner
3. Navigate to **"APIs & Services"** → **"Library"**
4. In the search bar, type: `Google Sheets API`
5. Click on **"Google Sheets API"** from the results
6. Click the **"Enable"** button
7. Wait for the API to be enabled (this may take a few minutes)

**Important**: This is the step that fixes the error you're seeing in your terminal:
```
Google Sheets API has not been used in project 858572276397 before or it is disabled
```

---

## Step 3: Create a Service Account

A service account allows your application to access Google Sheets without user interaction.

1. In Google Cloud Console, go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** at the top
3. Select **"Service Account"**
4. Fill in the service account details:
   - **Service account name**: `vickies-atelier-sheets`
   - **Service account ID**: (auto-generated, e.g., `vickies-atelier-sheets@...`)
   - **Description**: `Service account for accessing Google Sheets in Vickie's Atelier website`
5. Click **"Create and Continue"**
6. For **"Grant this service account access to project"**:
   - Select role: **"Editor"** (or **"Owner"** for full access)
   - Click **"Continue"**
7. Skip the optional **"Grant users access to this service account"** section
8. Click **"Done"**

---

## Step 4: Create and Download Service Account Key

1. In the **"Credentials"** page, find your newly created service account under **"Service Accounts"**
2. Click on the service account email (e.g., `vickies-atelier-sheets@...`)
3. Go to the **"Keys"** tab
4. Click **"Add Key"** → **"Create new key"**
5. Select **"JSON"** as the key type
6. Click **"Create"**
7. A JSON file will be downloaded to your computer
8. **IMPORTANT**: Keep this file secure! It contains sensitive credentials
9. Rename the file to something memorable like `vickies-atelier-service-account.json`

The JSON file will look like this:
```json
{
  "type": "service_account",
  "project_id": "vickies-atelier-xxxxx",
  "private_key_id": "xxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nxxxxx\n-----END PRIVATE KEY-----\n",
  "client_email": "vickies-atelier-sheets@vickies-atelier-xxxxx.iam.gserviceaccount.com",
  "client_id": "xxxxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "xxxxx"
}
```

---

## Step 5: Create Your Google Spreadsheet

Now you'll create the Google Sheet that will store your data.

### 5.1 Create a New Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Click **"Blank"** to create a new spreadsheet
3. Name it: `Vickie's Atelier - Data` (or your preferred name)
4. Copy the **Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```
   Save this ID - you'll need it for your environment variables

### 5.2 Create the Required Sheets

Your spreadsheet needs three sheets (tabs): **Config**, **Enquiries**, and **Orders**.

#### Sheet 1: Config

1. Rename the first sheet to `Config`
2. Add the following headers in row 1:
   - **A1**: `Key`
   - **B1**: `Value`
3. Add the following configuration data:

| Key | Value |
|-----|-------|
| bespoke_days | 7 |
| bridal_days | 7 |
| rtw_days | 7 |
| admin_email | vickiesatelier@gmail.com |

**What this does**: These values control how many days it takes to complete each type of order, and where admin notifications are sent.

**Your Config sheet should look like this**:
```
A                 B
Key               Value
bespoke_days      7
bridal_days       7
rtw_days          7
admin_email       vickiesatelier@gmail.com
```

#### Sheet 2: Enquiries

1. Click the **"+"** button at the bottom to add a new sheet
2. Name it `Enquiries`
3. Add the following headers in row 1:
   - **A1**: `Timestamp`
   - **B1**: `Name`
   - **C1**: `Email`
   - **D1**: `Message`

**What this does**: When customers submit the contact form in the footer, their enquiry is saved here.

**Your Enquiries sheet should look like this**:
```
A                    B        C                      D
Timestamp            Name     Email                  Message
(data will appear here when customers submit enquiries)
```

#### Sheet 3: Orders

1. Click the **"+"** button at the bottom to add another new sheet
2. Name it `Orders`
3. Add the following headers in row 1:
   - **A1**: `Timestamp`
   - **B1**: `Name`
   - **C1**: `Email`
   - **D1**: `Collection`
   - **E1**: `Bust (cm)`
   - **F1**: `Waist (cm)`
   - **G1**: `Hips (cm)`
   - **H1**: `Height (cm)`
   - **I1**: `Shoulder (cm)`
   - **J1**: `Sleeve (cm)`
   - **K1**: `Inseam (cm)`
   - **L1**: `Notes`
   - **M1**: `Estimated Ready Date`

**What this does**: When customers place orders with their measurements, the data is saved here.

**Your Orders sheet should look like this**:
```
A           B      C       D           E         F          G        H          I           J         K         L       M
Timestamp   Name   Email   Collection  Bust(cm)  Waist(cm)  Hips(cm) Height(cm) Shoulder(cm) Sleeve(cm) Inseam(cm) Notes  Estimated Ready Date
(data will appear here when customers place orders)
```

### 5.3 Format Your Sheets (Optional but Recommended)

For better readability:
1. **Bold the header rows** (row 1 in each sheet)
2. **Freeze the header rows**: Select row 1, then go to View → Freeze → 1 row
3. **Adjust column widths** to fit the content
4. **Add alternating colors**: Select all data, then Format → Alternating colors

---

## Step 6: Share Spreadsheet with Service Account

This is a critical step! Your service account needs permission to access the spreadsheet.

1. Open your Google Spreadsheet
2. Click the **"Share"** button in the top-right corner
3. In the **"Add people and groups"** field, paste the **service account email** from your JSON file
   - It looks like: `vickies-atelier-sheets@vickies-atelier-xxxxx.iam.gserviceaccount.com`
4. Set the permission to **"Editor"**
5. **UNCHECK** the box that says "Notify people" (the service account doesn't need an email notification)
6. Click **"Share"** or **"Done"**

---

## Step 7: Configure Environment Variables

Now you'll add the credentials to your `.env.local` file.

### 7.1 Extract Values from JSON File

Open the JSON file you downloaded in Step 4 and find these values:
- `client_email` → This is your **GOOGLE_SERVICE_ACCOUNT_EMAIL**
- `private_key` → This is your **GOOGLE_PRIVATE_KEY**

### 7.2 Update .env.local

Open your `.env.local` file and add/update these variables:

```env
# Google Sheets API Configuration
GOOGLE_SHEET_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=vickies-atelier-sheets@vickies-atelier-xxxxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Admin email for order notifications
ADMIN_EMAIL=vickiesatelier@gmail.com
```

**Important Notes**:
- Replace `your_spreadsheet_id_here` with the ID from your spreadsheet URL
- Replace the service account email with your actual service account email
- The private key should be wrapped in quotes and include the `\n` characters
- Make sure there are no extra spaces or line breaks

### 7.3 Example .env.local

Here's what your complete `.env.local` might look like:

```env
# Google Sheets API Configuration
GOOGLE_SHEET_ID=1AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
GOOGLE_SERVICE_ACCOUNT_EMAIL=vickies-atelier-sheets@vickies-atelier-123456.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# Admin email for order notifications
ADMIN_EMAIL=vickiesatelier@gmail.com

# Email Configuration (if you have these set up)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Google Calendar API (if you have this set up)
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
```

---

## Step 8: Test the Integration

### 8.1 Restart Your Development Server

1. Stop your development server (Ctrl+C in the terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

### 8.2 Test the Contact Form

1. Open your website: `http://localhost:3000`
2. Scroll to the footer
3. Fill out the contact form:
   - Name: Test User
   - Email: test@example.com
   - Message: Testing Google Sheets integration
4. Click **"Send Enquiry"**
5. You should see a success message
6. Check your Google Sheet's **Enquiries** tab - you should see the new entry!

### 8.3 Test the Order Form

1. Go to `http://localhost:3000/order`
2. Fill out the order form with test data
3. Submit the order
4. Check your Google Sheet's **Orders** tab - you should see the new order!

### 8.4 Check for Errors

If you see errors in the terminal, check the [Troubleshooting](#troubleshooting) section below.

---

## Troubleshooting

### Error: "Google Sheets API has not been used in project..."

**Solution**: Go back to [Step 2](#step-2-enable-google-sheets-api) and make sure you enabled the Google Sheets API for your project. Wait a few minutes after enabling it.

### Error: "The caller does not have permission"

**Solution**: Make sure you completed [Step 6](#step-6-share-spreadsheet-with-service-account) and shared the spreadsheet with your service account email.

### Error: "Unable to parse range: Config!A:B"

**Solution**: Make sure your spreadsheet has a sheet named exactly `Config` (case-sensitive). Check [Step 5.2](#sheet-1-config).

### Error: "Invalid credentials"

**Solution**: 
1. Check that your `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY` in `.env.local` are correct
2. Make sure the private key includes the `\n` characters and is wrapped in quotes
3. Restart your development server after changing `.env.local`

### Data Not Appearing in Spreadsheet

**Solution**:
1. Check that the sheet names match exactly: `Config`, `Enquiries`, `Orders`
2. Verify the spreadsheet ID in `.env.local` is correct
3. Make sure the service account has Editor permissions on the spreadsheet
4. Check the terminal for error messages

### Private Key Format Issues

If you're having trouble with the private key format:

1. Open your JSON file
2. Copy the entire `private_key` value (including the quotes)
3. Paste it directly into `.env.local`:
   ```env
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
   ```
4. Make sure it's all on one line with `\n` characters preserved

---

## Security Best Practices

1. **Never commit `.env.local` to Git** - It's already in `.gitignore`, but double-check
2. **Never share your service account JSON file** - Keep it secure
3. **Rotate credentials periodically** - Create new service account keys every few months
4. **Use environment-specific service accounts** - Different accounts for development and production
5. **Limit service account permissions** - Only grant the minimum required access

---

## Next Steps

Once Google Sheets is working, you may want to:

1. Set up **Google Calendar API** for consultation bookings (see `GOOGLE_CALENDAR_SETUP.md`)
2. Configure **email notifications** with Gmail SMTP
3. Set up **production environment** with proper credentials
4. Add **data validation** rules in your Google Sheet
5. Create **charts and dashboards** in Google Sheets to visualize your data

---

## Support

If you encounter issues not covered in this guide:

1. Check the [Google Sheets API documentation](https://developers.google.com/sheets/api)
2. Review the error logs in your terminal
3. Verify all environment variables are set correctly
4. Make sure all sheet names and column headers match exactly

---

## Summary Checklist

- [ ] Created Google Cloud Project
- [ ] Enabled Google Sheets API
- [ ] Created Service Account
- [ ] Downloaded Service Account JSON key
- [ ] Created Google Spreadsheet with 3 sheets: Config, Enquiries, Orders
- [ ] Added correct headers to each sheet
- [ ] Shared spreadsheet with service account email
- [ ] Updated `.env.local` with credentials
- [ ] Restarted development server
- [ ] Tested contact form successfully
- [ ] Tested order form successfully
- [ ] Verified data appears in Google Sheets

---

**Congratulations!** Your Google Sheets integration is now set up and ready to use. 🎉
