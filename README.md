# Life Drop Online Blood Bank System
A fully open, highly designed "Auth-Ready" web platform built for instant blood matching, inventory management, and emergency response capabilities. 

Built with modern UI practices (Glassmorphism, gradients, Chart.js integrations) and supported by a robust Express.js / MySQL backend.

## 🛠️ Technology Stack

### Frontend
- **HTML5 & CSS3**: Core structure with a custom "Glassmorphism" design system using CSS variables, custom properties, and responsive Flexbox/Grid layouts.
- **JavaScript (Vanilla)**: Handles dynamic DOM manipulation, interactive multi-step wizards, and REST API communication.
- **Libraries/Assets**: 
  - `Chart.js` for data visualization on dashboards.
  - `AOS` (Animate On Scroll) for smooth reveal transitions.
  - `Lucide Icons` for sleek, modern SVG iconography.
  - `canvas-confetti` for micro-animations on successful actions.

### Backend
- **Node.js**: Asynchronous JavaScript runtime environment.
- **Express.js**: Fast, unopinionated routing and middleware engine.
- **Architecture**: Separated into conceptual routes (`blood.js`, `donors.js`, `inventory.js`, `chatbot.js`).
- **Authentication**: Pre-configured (Auth-Ready) with `jsonwebtoken` (JWT) and `bcryptjs` for secure password hashing.

### Database
- **MySQL**: Relational database structuring users, hospitals, donors, inventory tracking, and active requests. Accessed via `mysql2/promise` for asynchronous querying.

---
## Project Architecture (Auth-Ready State)
**CURRENT STATE:** All public and dashboard functionalities (Finding Blood, Registering Donors, Broadcasting Hospital Requests, Admin Charts) are completely open and accessible **without requiring login**.

**SECURITY ARCHITECTURE:** The codebase already includes fully-coded, finalized Authentication engines (JWT Token Verification, BCrypt Hashing, Role-Based Access Controls). These are currently marked as "Dormant" via comments, allowing the platform to be fully secured in less than 5 minutes by simply uncommenting specific lines. 

---

## 🚀 Setup & Installation

### 1. Database Configuration
The application requires MySQL. Open your terminal or MySQL Workbench:
```bash
mysql -u root -p
```

Execute the database initialization scripts provided in the `/database` folder in this exact order:
1. `source <absolute path to database/schema.sql>` - *(Creates `bloodbank_db` and tables)*
2. `source <absolute path to database/seed.sql>` - *(Populates Indian city data and baseline metrics)*

### 2. Backend Initialization
1. Navigate to the `/backend` folder.
2. Provide an environment configuration file:
   - Create a `.env` file in the root of the `backend` folder containing:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=<Your MySQL Password>
DB_NAME=bloodbank_db
JWT_SECRET=super_secret_bloodbank_key_1234
JWT_EXPIRES_IN=24h
```
3. Install dependencies and start:
```bash
npm install
node server.js
```
*(You should see console output saying the server is running and the Auth-Ready configuration is active).*

### 3. Frontend Execution
The application does not require a complex build process. Simply serve the `frontend` folder using any local web server.
Example using Python:
```bash
cd frontend
python -m http.server 3000
```
Then visit [**http://localhost:3000**](http://localhost:3000) in your browser to access the application.
*(The backend API handles all requests natively at [http://localhost:5000](http://localhost:5000))*

---

## 🔒 Enabling Authentication (10 Minute Process)
When you are ready to secure the application behind Role-Based Logins (Admin, Donor, Hospital), follow these steps:

#### Step 1: Open the Backend Server
Navigate to `backend/server.js`.
Find the block labeled `AUTH READY: Uncomment the lines below to enable authentication` and remove all `//` from those specific module imports and the `app.use('/api/auth', ...)` line.

#### Step 2: Protect Specific API Routes
Open the route files inside `backend/routes/` (e.g., `blood.js`, `donors.js`, `requests.js`, `inventory.js`). 
At the top of each file, uncomment the `verifyToken` and `authorize` middleware imports. 
Then, insert those middlewares directly into the route endpoints as instructed by the comments above each function.

*Example in `donors.js`:*
Change:
`router.get('/', async (req, res) => {`
To:
`router.get('/', verifyToken, authorize('admin'), async (req, res) => {`

#### Step 3: Reveal Login Buttons on Frontend
Open the HTML files in the `frontend` folder (`index.html`, `search.html`, etc.).
Search for `<div class="auth-buttons-container">` hidden inside a comment block within the `<nav>` tag. Move that `<div>` block out of the comment tags so the **Sign In** and **Join Now** buttons appear in the top right navigation bar.

*Note: You may then need to update your frontend JS logic (e.g., `request.js` or `admin.js`) to reject unauthenticated activity by activating the `apiFetch` token injection already prepared in `main.js`.*
