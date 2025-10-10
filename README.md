# BookNest

**Live Demo:** https://booknest-dusky.vercel.app/

A full-stack MERN (MongoDB, Express, React, Node.js) bookstore web application with modern features like user authentication, admin dashboard, wishlist, chatbot, dark mode, and responsive design.

---

## 🚀 Features

### User-facing
- Signup / Login with JWT authentication  
- Browse & search books by title, author, category  
- Filter & sort books (price, rating, etc.)  
- Book Details view with description, reviews & “Add to Cart” / “Add to Wishlist”  
- Cart management: add, remove, update quantity  
- Wishlist: save favorite books and move to cart  
- Checkout (integrated with a dummy/test payment flow)  
- User profile: view & edit details, view order history  
- Dark mode toggle  
- Fully responsive on mobile, tablet & desktop  
- Floating chatbot to answer common FAQs (e.g. “How to order?”)  
- Toast / notification feedback for user actions  

### Admin & Backend
- Admin dashboard (only accessible to admin users)  
  - Add / Edit / Delete books  
  - Manage user accounts (view, block)  
  - View & manage all orders  
  - Dashboard analytics & charts (sales, users, popular books)  
- RESTful API with Express.js & Node.js  
- MongoDB (via Mongoose) for data storage  
- Models: User, Book, Order, Review, Message/Chat  
- Authentication & Authorization (JWT + role-based access)  
- Password encryption (using bcrypt)  
- Email verification & password reset via Nodemailer (if implemented)  
- Image upload via Cloudinary (for book cover images)  

---


Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```



## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

