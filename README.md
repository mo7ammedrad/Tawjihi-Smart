# Tawjihi - Online Learning and Course Management Platform

**Tawjihi** is a comprehensive, full-stack web platform designed for delivering interactive online education based on the **Tawjihi curriculum**. Built with the **MERN** stack (MongoDB, Express.js, React.js, Node.js), the system empowers **students**, **teachers**, and **administrators** to engage in modern digital learning through structured courses, rich lessons, secure payments, and user-friendly dashboards.

---

## 🎯 Target Audience

- **Students**: Browse and enroll in courses, watch video lessons, download materials, and track progress.
- **Teachers**: Create and manage courses, upload videos/documents, interact with students ,generator qouzi ai.
- **Administrators**: Oversee users, content, payments, and platform-wide settings,quzi ai ,.

---

## 🌟 Key Features

- 🔐 **Authentication & Authorization**: Role-based login for admins, teachers, and students using JWT and OAuth (Google & Facebook).
- 📚 **Course Management**:
  - Teachers can create, edit, and manage their own courses.
  - Students can browse by category, subject, or teacher.
- 🎬 **Lesson Delivery**: Each course includes structured lessons with videos, resources, and external links.
- 🛒 **Cart & Wishlist**: Add courses to shopping cart or wishlist for later.
- 💳 **Payment System**: Stripe integration for secure checkout.
- 📝 **Comments & Reviews**: Students can leave feedback and rate courses.
- 👨‍🏫 **Teacher Profiles**: View teacher bios, reviews, and associated courses.
- 📰 **News & Updates**: Section for platform-wide announcements and education-related news.
- 📱 **Responsive UI**: Works seamlessly across desktop, tablet, and mobile devices.
- ☁️ **Cloudinary Integration**: For uploading and managing media files.

---

## ⚙️ Tech Stack

### 🔧 Backend

- Node.js, Express.js
- MongoDB + Mongoose
- Passport.js, JWT, OAuth2
- Cloudinary, Stripe, Multer

### 🎨 Frontend

- React.js
- Styled Components
- CoreUI React Dashboard
- Lottie, Lucide Icons

### 📦 Other Libraries

- `bcryptjs` – Password encryption
- `validator` – Input validation
- `nodemailer` – Email delivery

---

## 🛠️ Installation

### 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)
- [Cloudinary](https://cloudinary.com/)
- [Stripe](https://stripe.com/)

---

### 🚀 Getting Started

#### 1. Clone the Repository

```bash
git clone https://github.com/ziadMorjan/Tawjihi.git
cd Tawjihi
```

#### 2. Backend Setup

```bash
cd backend
npm install
cp config-lock.env config.env
```

> Update `config.env` with your environment variables:

```env
# Environment
NODE_ENV=development
PORT=5000
BASE_URL=http://localhost:5000

# MongoDB
DB_URI=your_mongo_uri
DB_NAME=your_db_name

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRED=30d

# Frontend
FRONTEND_URL=http://localhost:3000

# OAuth
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
FACEBOOK_CLIENT_ID=your_facebook_id
FACEBOOK_CLIENT_SECRET=your_facebook_secret

# Email
HOST_EMAIL=your_email_host
PORT_EMAIL=your_email_port
USER_EMAIL=your_email_user
PASS_EMAIL=your_email_password

# Stripe
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

---

## ▶️ Running the App

Start backend server:

```bash
cd ../backend
npm run dev
```

Start frontend server:

```bash
cd ../frontend
npm start
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Seed Dummy Data (Optional)

```bash
cd backend/utils/dummyData

# To clear existing data
node seeder.js -d

# To insert sample data
node seeder.js -i
```

---

## 📬 API Documentation

Use the Postman collection to test APIs:

[🔗 Tawjihi API on Postman](https://lively-capsule-44952.postman.co/workspace/APIs~7f9a2d9f-44a8-4923-a28c-aa5ceddac228/collection/40896646-d0bf1d05-8fc6-4fcc-b200-92e506a8d974)

---

## 📚 Usage Flow

1. Register or login (via form or Google)
2. Browse available courses
3. Add to cart or wishlist
4. Checkout using Stripe
5. Watch lessons, download materials
6. Leave comments or reviews

---

## 👥 Contributors

- Mohammed eldabous
jamal abo deghaim
---

## 📄 License

Licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- All educators supporting open education
- Open-source tools & library maintainers
