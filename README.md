# 3vSkool Student Admission Portal

A full-stack student admission and enrollment portal built with **Next.js, TypeScript, PostgreSQL, Drizzle ORM, Better Auth, Tailwind CSS, and Razorpay**.

The application provides separate experiences for **students** and **administrators**, covering the complete admission workflow from account creation and application submission to payment, administrative review, approval/rejection, and status tracking.

---

## Overview

3vSkool Student Admission Portal is designed to simulate a real-world educational admission management system.

Students can:

- Create an account
- Log in securely
- Complete an admission application
- Enter academic details
- Upload required documents
- Review their application
- Pay the application fee
- Submit the application
- Track admission status
- View application history
- Print/save their submitted application
- View their profile and payment details

Administrators can:

- Log in using an admin account
- Access an admin-only dashboard
- View application statistics
- Search applications
- Filter by status and program
- Browse applications with pagination
- Open individual applications
- Review student details
- Review academic information
- View uploaded documents
- Verify payment information
- Start application review
- Approve or reject applications
- View status-change audit history

---

# Screens / Main Areas

The application currently contains three major areas:

```text
Public Website
│
├── Home
├── Programs
├── About
├── Admissions
├── Contact
├── Login
└── Register


Student Portal
│
├── Dashboard
├── Personal Details
├── Academic Details
├── Documents
├── Review
├── Payment
├── Final Submission
└── Profile


Admin Portal
│
├── Dashboard
├── Application Statistics
├── Applications List
├── Search
├── Filters
├── Pagination
├── Application Review
├── Documents
├── Payment Details
├── Admission Decisions
└── Audit History


---

# Tech Stack

## Frontend

* Next.js 16
* React
* TypeScript
* Tailwind CSS
* Lucide React Icons

## Backend

* Next.js App Router
* Next.js Server Components
* Next.js Server Actions
* Route Handlers

## Database

* PostgreSQL
* Drizzle ORM
* Drizzle Kit

## Authentication

* Better Auth
* Email/password authentication
* Role-based access control

## Payments

* Razorpay
* Razorpay Test Mode
* Server-side order creation
* Server-side signature verification

## File Handling

* Local private file storage during development
* File type validation using magic bytes
* File size validation
* Authenticated document access

---

# Current Architecture

```text
Browser
   │
   ▼
Next.js Application
   │
   ├─────────────── Public Pages
   │
   ├─────────────── Student Portal
   │
   └─────────────── Admin Portal
   │
   ▼
Authentication
Better Auth
   │
   ▼
Server Actions / API Routes
   │
   ├── Applications
   ├── Academic Details
   ├── Documents
   ├── Payments
   └── Admin Decisions
   │
   ▼
Drizzle ORM
   │
   ▼
PostgreSQL
```

Razorpay is integrated separately for payment processing:

```text
Student
   │
   ▼
Next.js
   │
   ▼
Create Razorpay Order
   │
   ▼
Razorpay Checkout
   │
   ▼
Payment
   │
   ▼
Server-side Signature Verification
   │
   ▼
PostgreSQL
```

---

# Features

## Public Website

The public-facing website includes:

* Responsive navigation
* Home page
* Programs page
* Individual program information
* About page
* Admissions information
* Contact page
* Responsive mobile navigation
* Shared footer

---

# Student Authentication

Students can create accounts using email and password.

Public registration automatically creates accounts with the:

```text
student
```

role.

Users cannot assign themselves the:

```text
admin
```

role.

The role is controlled server-side.

---

# Role-Based Authentication

Two roles currently exist:

```text
student
admin
```

After login:

```text
student
   ↓
/student/dashboard
```

```text
admin
   ↓
/admin
```

Protected layouts prevent users from accessing unauthorized areas.

For example:

```text
Student accessing /admin
→ blocked
```

```text
Admin accessing student-only application workflow
→ blocked
```

---

# Student Admission Workflow

The student application follows the following flow:

```text
Create Account
      ↓
Login
      ↓
Personal Details
      ↓
Academic Details
      ↓
Document Upload
      ↓
Review Application
      ↓
Payment
      ↓
Final Submission
      ↓
Application Locked
      ↓
Administrative Review
      ↓
Approved / Rejected
```

---

# Personal Details

Students provide information including:

* Full name
* Email
* Phone
* Date of birth
* Gender
* Address
* Selected program

Applications are associated directly with the authenticated user.

---

# Academic Details

Students provide:

* Qualification
* Institution
* Board / University
* Year of passing
* Score type
* Percentage / CGPA

Each application currently contains one academic-details record.

---

# Document Uploads

Students can upload:

### Required

* Passport-size photo
* Identity proof
* Class 10 certificate
* Class 12 certificate

### Optional

* Transfer certificate
* Other supporting document

Supported file types include:

```text
PDF
JPG
PNG
```

Uploads are validated using both:

* MIME/file type checks
* File magic-byte detection

Maximum file size:

```text
5 MB
```

Uploaded files are stored privately during development under:

```text
storage/
```

This directory is excluded from Git.

Documents are accessed through authenticated API routes rather than exposing the storage directory publicly.

---

# Application Locking

Applications become read-only after final submission.

Once submitted:

```text
Personal Details      → locked
Academic Details      → locked
Documents             → read-only
Payment               → view only
Application           → view only
```

Backend validation also prevents modification.

This means users cannot bypass the frontend by manually calling an API endpoint after submission.

---

# Application Statuses

The current application lifecycle supports:

```text
draft
submitted
under_review
approved
rejected
```

Normal workflow:

```text
Draft
  ↓
Submitted
  ↓
Under Review
  ↓
┌───────────┐
│           │
▼           ▼
Approved  Rejected
```

Invalid transitions are rejected server-side.

Examples:

```text
Draft → Approved
❌ Not allowed
```

```text
Submitted → Approved
❌ Not allowed
```

```text
Submitted → Under Review
✅ Allowed
```

```text
Under Review → Approved
✅ Allowed
```

```text
Under Review → Rejected
✅ Allowed
```

---

# Student Dashboard

The student dashboard displays:

* Application status
* Application number
* Selected program
* Document completion
* Payment status
* Profile access
* Application history

The UI changes depending on the current application status.

### Draft

```text
Application in Progress
```

### Submitted

```text
Application Submitted
Waiting for admissions review
```

### Under Review

```text
Application Under Review
```

### Approved

```text
Application Approved
```

### Rejected

```text
Application Not Approved
```

---

# Application History

Students can view a safe timeline of their admission process.

Example:

```text
Application Submitted
        ↓
Review Started
        ↓
Application Approved
```

Internal administrator information is not exposed on the student timeline.

---

# Application Review

Students can review all entered data before payment and final submission.

The review page contains:

* Personal details
* Selected program
* Academic details
* Uploaded documents
* Application status

---

# Print / Save Application

After payment is completed, students can print or save their application as PDF through the browser.

The printed application includes:

* Institution name
* Application ID
* Program
* Application status
* Submission date
* Personal details
* Academic information
* Uploaded document information

Navigation controls and unnecessary UI elements are hidden while printing.

---

# Razorpay Payment Integration

Razorpay Test Mode is currently used during development.

The payment flow is:

```text
Student
   ↓
Create Order API
   ↓
Razorpay Checkout
   ↓
Payment
   ↓
Verification API
   ↓
Signature Validation
   ↓
Database Payment Status = paid
```

Payment verification occurs server-side.

The application does not trust payment information returned directly from the browser.

---

# Payment Records

Payment information includes:

* Application ID
* Amount
* Currency
* Provider
* Razorpay Order ID
* Razorpay Payment ID
* Signature
* Status
* Payment timestamp

Payment statuses include:

```text
created
paid
failed
refunded
```

---

# Final Submission

Final submission is allowed only when:

```text
Personal details      ✅
Academic details      ✅
Required documents    ✅
Payment completed     ✅
Declaration accepted  ✅
```

After final submission:

```text
status = submitted
```

and the application becomes read-only.

---

# Admin Portal

Administrators have a separate protected area:

```text
/admin
```

Only authenticated users with:

```text
role = admin
```

may access it.

---

# Admin Dashboard

The dashboard displays real PostgreSQL statistics for:

* Total applications
* Submitted
* Under review
* Approved
* Rejected

Each statistics card is clickable.

For example:

```text
Approved
   ↓
/admin/applications?status=approved
```

Action text is displayed when hovering over dashboard cards.

---

# Admin Applications List

Administrators can view student applications in a responsive table.

Information includes:

* Application ID
* Student name
* Student email
* Program
* Application status
* Submission date
* Review link

A separate mobile layout is also provided.

---

# Admin Search

Administrators can search applications using:

```text
Student Name
Email Address
```

PostgreSQL case-insensitive search is implemented using:

```text
ILIKE
```

---

# Admin Filters

Applications can be filtered by:

## Status

* Draft
* Submitted
* Under Review
* Approved
* Rejected

## Program

Current program examples include:

* BCA
* B.Tech CSE
* BBA

Filters can be combined with search.

Example:

```text
Student: Rani
Status: Rejected
Program: BBA
```

---

# Pagination

The admin application list uses server-side pagination.

Default page size:

```text
10 applications
```

Example:

```text
Page 1
Applications 1–10

Page 2
Applications 11–20
```

Pagination preserves:

* Search
* Status filter
* Program filter

Example URL:

```text
/admin/applications?status=approved&program=bba&page=2
```

---

# Individual Admin Application Review

Administrators can open:

```text
/admin/applications/[id]
```

and review:

* Application status
* Personal information
* Program
* Academic information
* Uploaded documents
* Payment details
* Application history

---

# Admin Document Access

Students may only view their own uploaded documents.

Administrators may view documents belonging to any application they are reviewing.

The rules are:

```text
Student
→ own documents only
```

```text
Administrator
→ view student documents
```

```text
Student A
→ cannot view Student B's documents
```

Document deletion remains restricted to student-owned draft applications.

---

# Admin Decisions

When an application has:

```text
submitted
```

the administrator sees:

```text
Start Review
```

This changes:

```text
submitted
→
under_review
```

When an application is under review:

```text
Approve Application
Reject Application
```

are available.

After a final decision, further status changes are blocked.

---

# Application Audit History

Administrator status changes are stored permanently.

The `application_status_history` table records:

* Application ID
* Administrator user ID
* Previous status
* New status
* Timestamp

Example:

```text
submitted
→ under_review
by Administrator
```

followed by:

```text
under_review
→ approved
by Administrator
```

Status updates and audit-history creation occur inside the same database transaction.

If either operation fails:

```text
entire transaction
→ rollback
```

This avoids inconsistent application history.

---

# Database Structure

Important tables currently include:

```text
user
account
session
verification

applications
academic_details
documents
payments
application_status_history
```

---

# Project Structure

A simplified project structure:

```text
student-admission-portal/
│
├── app/
│   │
│   ├── actions/
│   │   ├── application.ts
│   │   ├── academic.ts
│   │   ├── final-submission.ts
│   │   └── admin-application.ts
│   │
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── applications/
│   │       ├── page.tsx
│   │       └── [id]/
│   │           └── page.tsx
│   │
│   ├── api/
│   │   ├── auth/
│   │   ├── documents/
│   │   └── payments/
│   │
│   ├── apply/
│   │   ├── academic/
│   │   ├── documents/
│   │   ├── review/
│   │   ├── payment/
│   │   └── submit/
│   │
│   ├── student/
│   │   ├── dashboard/
│   │   └── profile/
│   │
│   ├── about/
│   ├── admissions/
│   ├── contact/
│   ├── programs/
│   ├── login/
│   └── register/
│
├── components/
│   ├── application/
│   ├── AuthControls.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ...
│
├── data/
│   └── programs.ts
│
├── db/
│   ├── index.ts
│   ├── schema.ts
│   └── auth-schema.ts
│
├── drizzle/
│   └── migrations...
│
├── lib/
│   ├── auth.ts
│   ├── auth-client.ts
│   ├── razorpay.ts
│   └── payment-config.ts
│
├── scripts/
│   └── migrate.mjs
│
├── storage/
│   └── ignored by Git
│
├── types/
│
├── .env.example
├── .gitignore
├── drizzle.config.ts
├── package.json
└── README.md
```

---

# Getting Started

## Requirements

Install:

* Node.js
* npm
* PostgreSQL
* Git

Recommended:

```text
Node.js 20+
PostgreSQL 15+
```

---

# Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/student-admission-portal.git
```

Enter the project:

```bash
cd student-admission-portal
```

---

# Install Dependencies

```bash
npm install
```

---

# Environment Variables

Copy:

```bash
cp .env.example .env.local
```

Configure your local values.

Example:

```env
# PostgreSQL
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME

# Better Auth
BETTER_AUTH_SECRET=replace-with-a-secure-random-secret
BETTER_AUTH_URL=http://localhost:3000

# Razorpay Test Credentials
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_test_secret

# Application Fee
APPLICATION_FEE_PAISE=5000
```

`APPLICATION_FEE_PAISE=5000` means:

```text
₹50.00
```

because Razorpay uses the smallest currency unit.

---

# Important Security Warning

Never commit:

```text
.env
.env.local
database passwords
authentication secrets
Razorpay secrets
student uploaded documents
```

These are ignored through `.gitignore`.

Before pushing, verify:

```bash
git check-ignore -v .env.local
```

and:

```bash
git check-ignore -v storage
```

---

# PostgreSQL Setup

Create a PostgreSQL database and user.

Example:

```sql
CREATE USER skool_user WITH PASSWORD 'your-password';

CREATE DATABASE skool_admissions
OWNER skool_user;
```

Then configure `DATABASE_URL` in:

```text
.env.local
```

---

# Database Migrations

Generate a migration after changing the Drizzle schema:

```bash
npx drizzle-kit generate --name=your_migration_name
```

Run migrations using:

```bash
npm run db:migrate
```

The project includes a custom migration runner under:

```text
scripts/migrate.mjs
```

---

# Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Creating a Student Account

Use:

```text
/register
```

All public registrations receive:

```text
role = student
```

---

# Creating a Development Admin

There is intentionally no public "Register as Admin" option.

For local development:

1. Register a normal account.
2. Open PostgreSQL.

```bash
psql -h localhost -U skool_user -d skool_admissions
```

Check users:

```sql
SELECT
  id,
  name,
  email,
  role
FROM "user";
```

Promote the development account:

```sql
UPDATE "user"
SET role = 'admin'
WHERE email = 'your-admin@example.com';
```

Verify:

```sql
SELECT
  name,
  email,
  role
FROM "user";
```

Then logout and login again.

The admin should be redirected to:

```text
/admin
```

---

# Development Routes

## Public

```text
/
/programs
/programs/bca
/programs/btech-cse
/programs/bba
/about
/admissions
/contact
/login
/register
```

## Student

```text
/student/dashboard
/student/profile

/apply
/apply/academic
/apply/documents
/apply/review
/apply/payment
/apply/submit
```

## Admin

```text
/admin
/admin/applications
/admin/applications/[id]
```

---

# API Routes

Important APIs include:

```text
/api/auth/[...all]

/api/documents/upload
/api/documents/[id]

/api/payments/create-order
/api/payments/verify
```

---

# Security Features

Current development security protections include:

* Password authentication
* Session authentication
* Server-side role checks
* Student/admin route separation
* Server-side application ownership checks
* Submitted-application locking
* Private document storage
* Document file-size validation
* Document type validation
* File magic-byte validation
* Path traversal protection
* Razorpay signature verification
* Server-controlled payment amount
* Server-side final submission checks
* Server-side admission status transition validation
* Database transactions for admin audit history
* Environment secrets excluded from Git

---

# Git Workflow

The stable branch is:

```text
main
```

For future development, feature branches are recommended.

Example:

```bash
git switch main
git pull
git switch -c feat/document-verification
```

Make changes.

Then:

```bash
git status
git add .
git diff --cached
git commit -m "feat: add document verification"
```

Push:

```bash
git push -u origin feat/document-verification
```

After testing:

```bash
git switch main
git merge feat/document-verification
git push
```

---

# Recommended Commit Style

Examples:

```text
feat: add admin application filters

feat: add application audit history

feat: add student status timeline

feat: add server-side pagination

fix: prevent submitted application edits

fix: protect document access

style: improve admin dashboard

docs: update project README
```

---

# Current Development Status

## Completed

* [x] Next.js project setup
* [x] Tailwind CSS
* [x] Responsive navbar
* [x] Public website
* [x] Programs
* [x] About page
* [x] Admissions page
* [x] Contact page UI
* [x] PostgreSQL
* [x] Drizzle ORM
* [x] Database migrations
* [x] Better Auth
* [x] Student registration
* [x] Student login
* [x] Role-based authentication
* [x] Student dashboard
* [x] Personal application details
* [x] Academic details
* [x] Document uploads
* [x] Secure document viewing
* [x] Application review
* [x] Razorpay Test Mode
* [x] Payment verification
* [x] Final submission
* [x] Application locking
* [x] Print / Save PDF
* [x] Student profile
* [x] Admin login routing
* [x] Admin dashboard
* [x] Real application statistics
* [x] Admin application list
* [x] Admin application review
* [x] Admin document viewing
* [x] Admin payment viewing
* [x] Start review workflow
* [x] Approve/reject workflow
* [x] Application audit history
* [x] Student application history
* [x] Admin search
* [x] Status filtering
* [x] Program filtering
* [x] Server-side pagination
* [x] Clickable admin statistics


# Important Development Note

The current file-storage implementation is intended for local development.

Uploaded files currently live under:

```text
storage/
```

Production deployments should move this to durable object storage such as:

```text
Amazon S3
Cloudflare R2
Supabase Storage
or another secure object-storage provider
```

The local `storage/` directory must never be committed to Git.

---

# Project Goal

The goal of this project is not only to build a working admission portal, but also to learn how a production-style full-stack application is structured.

The project demonstrates:

```text
Frontend Development
        +
Backend Development
        +
Database Design
        +
Authentication
        +
Authorization
        +
File Handling
        +
Payment Integration
        +
Security
        +
Admin Workflows
        +
Audit Logging
        +
Git Workflow
```

---

# License

This project is currently intended for educational and development purposes.

A formal open-source license can be added later if the project is released publicly.

---

# Author

**Thrivanesar U**

Built as a full-stack learning project focused on developing a complete student admission and administration system.

````

Then save it as:

```text
README.md
````

and commit it separately:

```bash
git add README.md
git status
git diff --cached
git commit -m "docs: add comprehensive project README"
git push
```

One small recommendation: replace `YOUR_USERNAME` in the clone command with your actual GitHub username before committing the README, so the clone command works directly from the repository.
