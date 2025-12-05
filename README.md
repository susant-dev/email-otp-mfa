# Lab 8 - Final Lab

> Weightage: 2.5  
> Deadline: 11:59 AM (Nov 25).  
> _Submissions after the deadline will receive only **75%** of the points earned._

---

### Overview:

In this lab is you will implement a secure user management system with the following features:

- Role-Based Access Control (RBAC) – Different permissions for admin and customer users.
- Email-based OTP (One-Time Password) Login – Users can login via OTP sent to their email.
- JWT Authentication – Secure token-based authentication
- Ownership Checks – Customers can only access or update their own profile.

---

#### .env

1. In the root of your project, create a file named .env.
2. Add the following environment variables:
   ```
   DB_URL="" # The MongoDB connection URL
   DB_NAME="cpan212_lab7" # Name of your lab database
   TOKEN_SECRET="" # Secret key used to sign JWT tokens
   GOOGLE_EMAIL="" # Email to use while sending email
   GOOGLE_PASSWORD="" # App password to use while sending email
   ```
   > Note: Replace the empty strings with appropriate values. Keep .env secret and do not commit it to version control.

---

#### Add roles to User Schema

**File: modules/users/users-model.js**

- Add a roles field to the user schema.
- Roles can be "admin" or "customer". Hint: use mongodb enum
- Default role should be "customer".
- Make the field required.

---

#### Implement sendEmail utility

**File: ./shared/email-utils.js**

1. Validate input parameters:
   - Ensure to (recipient email) is provided.
   - Ensure subject is provided.
   - Ensure message (email body) is provided.

- If any are missing, throw an error indicating which parameter is required.

2. Send the email:

- Use the Nodemailer transporter to send the email.
- Set the from field to GOOGLE_EMAIL.
- Set to, subject, and text fields with the provided arguments.

3. Handle errors:

- Wrap the sending logic in a try/catch block.
- Log any errors to the console.
- Throw the error so it can be handled by the caller.

---

#### Modify /users/login route

**File: modules/users/users-route.js**

- After pass is matched:
- Generate a random 6-digit OTP using randomNumberOfNDigits from ./shared/compute-utils.js.
- Save the OTP in OTPModel (./modules/users/otp-model.js) linked to user email.
- Send OTP via email using sendEmail.
- Respond with success message confirming OTP sent.

---

#### Implement /users/verify-login route

**File: modules/users/users-route.js**

- On OTP verification:
- Read email and otp from request body.
- Fetch the saved OTP from OTPModel.
- If OTP is missing or invalid → respond with verification failed.
- If OTP is valid:
- Generate JWT token using encodeToken from ./shared/jwt-utils.js.
- Respond with token and user data.

---

#### Protect routes with role-based access

**File: modules/users/users-route.js**

- Use authorize middleware for specific routes:
- GET /users = Admin only
- GET /users/:id = Admin or Customer
- PUT /users/:id = Admin or Customer
- DELETE /users/:id = Admin only

---

#### Test using postman

1. **Test `/users/register` route**

   - Register a new user.
   - Check that the user is created in the database.
   - Verify that the password is **hashed** in the MongoDB document.

2. **Test `/users/login` route**

   - Log in with a registered user.
   - Ensure that `randomNumberOfNDigits` generates a 6 digit numbers.
   - Ensure that `sendEmail` sends the email.

3. **Test `/users/verify-login` route**

   - Verify the otp and email.
   - Ensure that `encodeToken` generates a valid JWT token.

4. **Test `GET /users`, `GET /users/:id`, `PUT /users/:id`, and `DELETE /users/:id` route**

   - Verify that `authorize` middleware works correctly.

---
