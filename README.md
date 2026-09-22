# 🏰 WonderDnd — Full-Stack AWS Practice Project

A clean, decoupled full-stack property listing web application (inspired by Airbnb / Wanderlust) built with **React + Vite (Frontend)** and **Express.js + MongoDB (Backend)**, specifically designed for hands-on **AWS Cloud Deployment Practice**.

---

## 📁 Clean Project Structure

```
WonderDnd/
├── backend/                  # RESTful API Service (Node.js / Express.js)
│   ├── src/
│   │   ├── config/db.js      # MongoDB Connection (Atlas / Local)
│   │   ├── controllers/      # Listing CRUD business logic
│   │   ├── models/Listing.js # Mongoose Schema & validation
│   │   ├── routes/           # REST endpoints (/api/listings, /api/health)
│   │   ├── utils/            # Async error wrappers & custom error classes
│   │   ├── data/             # Seeding script and 24+ sample listings
│   │   └── server.js         # API entrypoint with CORS & middleware
│   ├── .env.example          # Environment variables template
│   ├── .env                  # Backend environment configuration
│   └── package.json          # Backend dependencies & scripts
│
├── frontend/                 # Single Page Application (React 18 + Vite)
│   ├── src/
│   │   ├── components/       # Navbar, Footer, CategoryFilter, ListingCard, Toast
│   │   ├── pages/            # Home/Explore, ListingDetail, NewListing, EditListing
│   │   ├── services/api.js   # Centralized Axios API client configured with VITE_API_URL
│   │   ├── context/          # Global Toast Notification provider
│   │   ├── App.jsx           # Client-side React Router routing
│   │   ├── main.jsx          # React DOM entrypoint
│   │   └── index.css         # Modern Wanderlust UI styles & design tokens
│   ├── .env.example          # Frontend environment template
│   ├── .env                  # Frontend environment configuration
│   ├── vite.config.js        # Vite configuration & proxy settings
│   ├── index.html            # HTML entry point
│   └── package.json          # Frontend dependencies & scripts
│
├── README.md                 # Complete AWS Deployment & Architecture Guide
└── package.json              # Monorepo runner for running both services
```

---

## 🚀 Quick Start (Local Development)

### 1. Install All Dependencies
Run from the root directory to install dependencies for root, backend, and frontend:
```bash
npm run install:all
```

*(Or install individually: `cd backend && npm install` and `cd ../frontend && npm install`)*

---

### 2. Seed the Database
Populate your MongoDB Atlas cluster (or local MongoDB) with 24+ sample listings across categories (Beachfront, Mountain, Luxury, Castles, Camping, etc.):
```bash
npm run seed
```

---

### 3. Start Development Servers
Run both Backend and Frontend concurrently with a single command:
```bash
npm run dev
```

- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8576](http://localhost:8576)
- **Healthcheck**: [http://localhost:8576/api/health](http://localhost:8576/api/health)
- **Listings Endpoint**: [http://localhost:8576/api/listings](http://localhost:8576/api/listings)

> **Tip:** You can also run them in separate terminals:
> - Backend: `npm run dev:backend`
> - Frontend: `npm run dev:frontend`

---

## ☁️ Step-by-Step AWS Deployment Practice Guide

This project is tailored to practice the standard, real-world AWS 2-tier architecture:
- **Frontend**: Hosted as a static SPA on **AWS S3 + CloudFront CDN**
- **Backend**: Hosted on **AWS EC2 (with PM2 / Nginx)** or **Elastic Beanstalk**
- **Database**: Cloud Database on **MongoDB Atlas** or **AWS DocumentDB**

```
 [Users / Browsers]
         │
         ├───► [AWS CloudFront CDN + S3 Bucket] (Serves React Frontend SPA)
         │
         └───► [AWS EC2 / ALB / Beanstalk] (Serves Express REST API on Port 8576)
                     │
                     └───► [MongoDB Atlas / AWS DocumentDB]
```

---

### 🌐 Part 1: Deploy Backend REST API to AWS EC2

#### 1. Launch an EC2 Instance
1. Open the **AWS EC2 Console** -> Click **Launch Instance**.
2. **Name**: `wonderdnd-backend-api`
3. **AMI**: `Ubuntu Server 24.04 LTS` (Free Tier eligible).
4. **Instance Type**: `t2.micro` or `t3.micro`.
5. **Key Pair**: Select an existing key pair or create a new one (e.g. `wonderdnd-key.pem`).
6. **Network Settings (Security Group)**:
   - Allow **SSH** (Port 22) from your IP.
   - Allow **HTTP** (Port 80) from Anywhere (`0.0.0.0/0`).
   - Allow **Custom TCP** (Port 8576) from Anywhere (`0.0.0.0/0`).
7. Click **Launch Instance**.

#### 2. Connect to EC2 via SSH
```bash
chmod 400 wonderdnd-key.pem
ssh -i "wonderdnd-key.pem" ubuntu@<YOUR_EC2_PUBLIC_IPv4_ADDRESS>
```

#### 3. Install Node.js & Git on EC2
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git
node -v # Should display v20.x.x
```

#### 4. Clone / Copy Backend Code to EC2
```bash
git clone <YOUR_GITHUB_REPO_URL>
cd WonderDnd/backend
npm install --production
```

#### 5. Configure `.env` on EC2
Create the production `.env` file:
```bash
nano .env
```
Paste your configuration:
```env
PORT=8576
NODE_ENV=production
MONGO_URI="mongodb+srv://<username>:<password>@cluster0.bkdtaw6.mongodb.net/aws-practice"
CORS_ORIGIN=*
```
*(Press `Ctrl + O`, `Enter`, then `Ctrl + X` to save and exit).*

#### 6. Run the API with PM2 (Process Manager)
```bash
sudo npm install -g pm2
pm2 start src/server.js --name "wonderdnd-api"
pm2 save
pm2 startup
```

#### 7. Test the Live API
In your browser or terminal, verify:
```bash
curl http://<YOUR_EC2_PUBLIC_IP>:8576/api/health
```
You should receive:
```json
{"status":"healthy","service":"WonderDnd-Backend-API","environment":"production"}
```

---

### ⚡ Part 2: Deploy Frontend SPA to AWS S3 & CloudFront

#### 1. Point Frontend to Your EC2 Backend API
In your local `frontend/.env` (or create `frontend/.env.production`):
```env
VITE_API_URL=http://<YOUR_EC2_PUBLIC_IP>:8576/api
```

#### 2. Build the Production Bundle
Inside the `frontend` folder:
```bash
npm run build
```
This generates the optimized production build in `frontend/dist/`.

#### 3. Create & Configure S3 Bucket
1. Open the **AWS S3 Console** -> Click **Create bucket**.
2. **Bucket name**: `wonderdnd-frontend-<unique-id>` (e.g. `wonderdnd-frontend-rahul`).
3. **Block Public Access settings**: Uncheck *Block all public access* (acknowledge warning).
4. Click **Create bucket**.
5. Open your bucket -> Go to **Properties** -> Scroll down to **Static website hosting** -> Click **Edit**:
   - Enable **Static website hosting**.
   - **Index document**: `index.html`
   - **Error document**: `index.html` *(Essential for React Router SPA)*.
   - Click **Save changes**.
6. Go to **Permissions** -> **Bucket Policy** -> Click **Edit** and paste:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::<YOUR_BUCKET_NAME>/*"
       }
     ]
   }
   ```
7. Go to **Objects** tab -> Click **Upload** -> Upload all files inside `frontend/dist/` (`index.html`, `assets/`, etc.).

#### 4. Add CloudFront CDN (HTTPS & Edge Caching)
1. Open the **AWS CloudFront Console** -> Click **Create distribution**.
2. **Origin domain**: Select your S3 bucket website endpoint.
3. **Viewer protocol policy**: Select `Redirect HTTP to HTTPS`.
4. Go to **Custom error responses** tab -> Click **Create custom error response**:
   - **HTTP error code**: `403` and `404`
   - **Response page path**: `/index.html`
   - **HTTP response code**: `200`
5. Click **Create distribution**.
6. Your live site will now be accessible via your fast, secure CloudFront URL: `https://<distribution-id>.cloudfront.net`!

---

### 🌿 Part 3: Alternative Backend Deployments

#### Option A: AWS Elastic Beanstalk
```bash
cd backend
npm install -g awsebcli
eb init -p node.js wonderdnd-api --region us-east-1
eb create wonderdnd-api-prod
eb setenv MONGO_URI="mongodb+srv://..." PORT=8576
eb open
```

#### Option B: AWS App Runner
1. Push code to GitHub.
2. Open **AWS App Runner** -> Create Service from Source Code repository.
3. Set build command: `cd backend && npm install` and start command: `node src/server.js`.
4. Add environment variables `PORT=8576` and `MONGO_URI`.

---

## 📡 REST API Reference

| Method | Route | Description | Query Params / Body |
|---|---|---|---|
| `GET` | `/api/health` | Service healthcheck for AWS Load Balancers | None |
| `GET` | `/api/listings` | Fetch all destination listings | `?search=Goa` & `?category=Beachfront` |
| `GET` | `/api/listings/:id` | Fetch details for a specific listing | None |
| `POST` | `/api/listings` | Create a new listing | JSON `{ title, description, price, location, country, image, category }` |
| `PUT` | `/api/listings/:id` | Update an existing listing | JSON `{ title, description, price, location, country, image, category }` |
| `DELETE` | `/api/listings/:id` | Delete a listing by ID | None |

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
| Variable | Required | Description | Example |
|---|---|---|---|
| `PORT` | Yes | Port to listen on | `8576` |
| `MONGO_URI` | Yes | MongoDB connection string | `mongodb+srv://<user>:<pwd>@cluster.mongodb.net/aws-practice` |
| `NODE_ENV` | No | Environment mode | `development` or `production` |
| `CORS_ORIGIN` | No | Allowed frontend origin | `*` or `http://localhost:5173` |

### Frontend (`frontend/.env`)
| Variable | Required | Description | Example |
|---|---|---|---|
| `VITE_API_URL` | Yes | URL to the Backend REST API | `http://localhost:8576/api` (local) or `http://<EC2-IP>:8576/api` (AWS) |

---

## 🛠️ Tech Stack Summary

- **Frontend**: React 18, Vite, React Router v6, Axios, Lucide Icons, Plus Jakarta Sans font, CSS3 Design Tokens.
- **Backend**: Node.js, Express 4.x, Mongoose 8.x, Dotenv, CORS.
- **Database**: MongoDB Atlas / AWS DocumentDB.
- **AWS Services**: EC2, S3, CloudFront CDN, Elastic Beanstalk, Application Load Balancers, Security Groups.
