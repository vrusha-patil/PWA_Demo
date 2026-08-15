# Store Rating System

A full-stack Store Rating System built using React.js, Node.js, Express.js, and MySQL.

The application supports three roles:

- Admin
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

### Admin
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

## Validation

- Name: 20-60 characters
- Address: maximum 400 characters
- Password: 8-16 characters
- Password requires at least one uppercase letter
- Password requires at least one special character
- Email validation
- Store rating: 1-5

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
- XAMPP
- phpMyAdmin

### API Testing
- Postman

---

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