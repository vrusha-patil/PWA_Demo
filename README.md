# Store Rating System

A full-stack Store Rating System built using React.js, Node.js, Express.js, and MySQL.

## Live Demo

The application is deployed on Render.

- Live Application: https://demo-render-mysql-hosting-frontend.onrender.com

The application supports three roles:

- System Administrator
- Normal User
- Store Owner

Users can register, login, view stores, submit ratings, update ratings, and change their passwords. Admins can manage users and stores, while store owners can view their store ratings.

---



## Features

### Authentication
- User registration and login
- JWT authentication
- Role-based access control
- Protected routes
- Password hashing with bcrypt.js
- Change password
- Logout

### System Administrator
- Admin dashboard
- View users and stores
- Add users and stores
- Search and filter data
- Manage store owners and administrators
- View ratings

### Normal User
- Register and login
- Search stores by name or address
- View overall store ratings
- Submit ratings from 1 to 5
- Update submitted ratings
- Change password

### Store Owner
- View store information
- View average rating
- View total ratings
- View users' submitted ratings
- View rating dates
- Change password

---

## Technologies Used

### Frontend
- React.js
- Vite
- JavaScript
- Axios
- CSS

### Backend
- Node.js
- Express.js
- JWT
- bcrypt.js
- CORS
- dotenv


### Database
- MySQL
- Local development: XAMPP / phpMyAdmin
- Deployment : MySQL hosted on Aiven (cloud)

### API Testing
- Postman

## Demo Credentials

These accounts are provided for testing/demo purposes.

### Admin

- Email: admin1@gmail.com
- Password: Admin@321
- Role: ADMIN

### Store Owner

- Email: pranayapatil33@gmail.com
- Password: Pranay@2206
- Role: OWNER

### Normal User

- Email: jay123@gmail.com
- Password: Jayraj@123
- Role: NORMAL USER

You can also create a new account using the Register option.

## Project Structure

```text
Store-Rating-System/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── createAdmin.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md

