# Lion Kicks 🦁👟 - E-commerce Shoe Store

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-green)](https://www.mongodb.com/)

A full-featured e-commerce platform for buying quality shoes in Rwanda with USD/FRW pricing.

## 🌟 Features

- **User Authentication**: Register, login, logout with secure password hashing
- **Product Catalog**: 24 shoes across 3 categories (Men, Women, Kids)
- **Shopping Experience**: 
  - Browse by category
  - Detailed product views
  - Real-time price calculation (USD & FRW)
- **Checkout System**:
  - Add to cart functionality
  - Delivery fee calculation
  - Tax calculation (18% VAT)
  - Order confirmation
- **User Dashboard**:
  - Profile management
  - Update username/password
  - Order history
- **Admin Features** (coming soon):
  - Product management
  - Order management
  - User management

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Backend runtime |
| **Express.js** | Web framework |
| **MongoDB** | Database |
| **Mongoose** | MongoDB ODM |
| **EJS** | Template engine |
| **Express Session** | Authentication sessions |
| **bcrypt** | Password hashing |
| **Tailwind CSS** | Styling |

## 📁 Project Structure
lion-kicks/
├── server.js # Main application file
├── package.json # Dependencies and scripts
├── .env # Environment variables
├── Procfile # Deployment configuration
├── models/ # MongoDB models
│ ├── Shoe.js
│ ├── User.js
│ └── Order.js
├── views/ # EJS templates
│ ├── index.ejs # Homepage
│ ├── about.ejs # About page
│ ├── contact.ejs # Contact page
│ ├── buy.ejs # Product purchase page
│ ├── profile.ejs # User profile page
│ ├── 404.ejs # 404 error page
│ ├── auth/ # Authentication views
│ │ ├── login.ejs
│ │ └── register.ejs
│ ├── shop/ # Shop views
│ │ ├── index.ejs
│ │ ├── men.ejs
│ │ ├── women.ejs
│ │ ├── kids.ejs
│ │ └── detail.ejs
│ └── partials/ # Reusable partials
│ ├── header.ejs
│ └── footer.ejs
└── public/ # Static files
├── images/ # Product images
├── css/ # Custom CSS
│ └── style.css
└── js/ # JavaScript files
└── script.js

