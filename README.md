# Library-api
A simple backend library management system built with MongoDB, Express.js and Node.js

## Techonologies used in this application
  * Express.js
  * MongoDB (mongoose.js)
  * Node.js
  * bcryptjs
  * jsonwebtoken.js
  * joi.js (validation)
  * Nodemailer (Using Gmail)
  * multer.js
  * Cloudinary

## App is divided into two modules
  * User
  * Issue
  * Book
  
## User module functionalities
  * Sign up - send confirmation email with link
  * Confirm email - Clicking on the link in the confirmation mail
  * Login
  * Log out
  * Get user account info
  * Update user account
  * Delete user account
  * Upload Profile Picture (Local - cloud)

## Issue module functionalities
  * Issue book (borrow)
  * Get logged in user's issued books
  * Get logged in user's not returned books
  * Return book

## Book module functionalities
 * Get all books info
 * Admin User:
   - Create book doc
   - Upload book picture (local - cloud)
