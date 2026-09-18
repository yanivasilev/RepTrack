# RepTrack

**RepTrack** is a full-stack fitness tracking mobile application that combines workout logging, progress analytics, community features, and AI-powered exercise form analysis.

The application is built with **React Native + Expo + TypeScript** on the client and **Node.js + Express + TypeScript** on the server. It uses **Prisma ORM with SQLite** for data persistence and computer-vision tooling to analyse uploaded exercise videos.

Originally developed as a university final-year project, RepTrack explores how conventional workout tracking can be combined with pose estimation to provide more useful feedback to users.

---

## Project Overview

![RepTrack architecture, AI analysis pipeline and database overview](docs/images/reptrack_system_architecture.png)

---

## Features

### Workout Tracking

- Start and save workout sessions
- Record exercises, sets, repetitions, weight, and timed exercises
- Browse a seeded exercise library covering bodyweight, barbell, dumbbell, cable, machine, kettlebell, band, and cardio exercises
- View previous workout sessions
- Track workout duration and training volume
- Delete previously recorded workouts

### Progress & Statistics

RepTrack calculates workout statistics across multiple time periods, including:

- Last 7 days
- Last 30 days
- Last 365 days
- All-time statistics

Tracked metrics include:

- Number of workouts
- Total exercises
- Total sets
- Total repetitions
- Training time
- Training volume
- Current workout streak
- Best workout streak

Chart data is prepared for display using `react-native-chart-kit`.

### Workout Suggestions

RepTrack can generate suggestions for an exercise based on the user's recent training history.

The backend analyses the user's most recent sessions for the selected exercise and uses previous repetitions, weight, or duration to generate the next suggestion.

### AI-Powered Exercise Analysis

RepTrack includes a video-based exercise analysis system.

Users can upload an exercise video, which is processed by the backend to:

1. Extract video frames
2. Estimate body pose/keypoints
3. Analyse movement through the detected keypoints
4. Count repetitions
5. Evaluate individual repetitions
6. Return feedback to the mobile application

The current implementation supports **push-up analysis** and returns:

- Total repetitions
- Good repetitions
- Bad repetitions
- Per-repetition feedback
- Pose keypoints
- Rep start and end timestamps
- Overall exercise feedback

Uploaded videos and temporary extracted frames are removed after processing.

### User Accounts & Profiles

- User registration
- Login using JWT-based authentication
- Email verification
- Forgot-password flow
- Password reset
- Profile information
- Avatar uploads
- Change username
- Change password
- Update account details
- Metric and imperial unit preferences

### Community

RepTrack also includes a lightweight fitness community system where authenticated users can:

- Create discussion threads
- Edit and delete their own threads
- Reply to threads
- Edit and delete replies
- Like and unlike threads
- Like and unlike replies
- View user profiles
- View a user's threads and replies

### Achievements

The application contains an achievement/badge system covering milestones such as:

- First workout
- Workout-count milestones
- Total training-time milestones
- Workout streaks
- Training-volume milestones

---

## Tech Stack

| Area | Technologies |
| --- | --- |
| Mobile | React Native, Expo, TypeScript |
| Navigation | React Navigation |
| API communication | Axios |
| Backend | Node.js, Express, TypeScript |
| Database | SQLite |
| ORM | Prisma |
| Validation | Zod |
| Authentication | JWT, bcrypt |
| Security | Helmet, CORS, Express Rate Limit |
| File uploads | Multer |
| Email | Nodemailer |
| Computer Vision | TensorFlow.js, TensorFlow pose detection |
| Video Processing | FFmpeg |
| Charts | react-native-chart-kit |
| Local/Secure Storage | AsyncStorage, Expo SecureStore |

---

## Architecture

RepTrack is split into two main applications:

```text
React Native / Expo Client
          |
          | HTTP / REST API
          v
Node.js / Express API
          |
          +--------------------+
          |                    |
          v                    v
     Prisma ORM          Exercise Analysis
          |              / Pose Estimation
          v                    |
       SQLite             Video Processing
```

The backend follows a controller/service-oriented structure. API routes validate incoming data before passing it to application services, while Prisma handles database access.

---

## Project Structure

```text
RepTrack/
├── back-end/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── controllers/
│   │   ├── libs/
│   │   ├── middleware/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── db.ts
│   │   └── index.ts
│   └── package.json
│
├── front-end/
│   ├── components/
│   ├── hooks/
│   ├── navigation/
│   ├── screens/
│   ├── App.tsx
│   └── package.json
│
└── docs/
```

---

## REST API

The Express backend exposes authenticated REST endpoints grouped around the application's main features.

### Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/forgot-password
POST /auth/forgot-password/verify
POST /auth/forgot-password/reset
POST /auth/email-verification
POST /auth/email-verification/verify
GET  /auth/check
```

### Profile & Settings

```text
GET /profiles
GET /profiles/me
GET /profiles/:userId
GET /profiles/:userId/threads
GET /profiles/:userId/replies

PUT /settings/change-details
PUT /settings/change-password
PUT /settings/change-username
PUT /settings/change-avatar
```

### Community

```text
GET    /threads
GET    /threads/:threadId
POST   /threads
PATCH  /threads/:threadId
DELETE /threads/:threadId

POST   /threads/:threadId/like
DELETE /threads/:threadId/like

POST   /reply/:threadId
PATCH  /reply/:replyId
DELETE /reply/:replyId

POST   /reply/:replyId/like
DELETE /reply/:replyId/like
```

### Workouts

```text
POST   /workouts
GET    /workouts/:workoutId
DELETE /workouts/delete/:workoutId

GET /workouts-history
GET /workouts-stats
GET /workouts-suggestion/:exerciseId
```

### Exercises & Analysis

```text
GET  /exercises
GET  /exercises/:exerciseId
POST /exercise-analysis/:exerciseId
```

---

## Getting Started

### Prerequisites

You will need:

- Node.js
- npm
- Expo / an Android or iOS development environment
- A configured backend `.env` file

Clone the repository:

```bash
git clone https://github.com/yanivasilev/RepTrack.git
cd RepTrack
```

---

## Backend Setup

Move into the backend directory:

```bash
cd back-end
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and configure the environment variables required by the application.

At minimum, the backend source expects a database URL and JWT secret:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="replace-with-a-secure-secret"
PORT=3000
```

Email verification and password-recovery functionality also require the email configuration used by the Nodemailer integration.

Generate the Prisma client:

```bash
npx prisma generate
```

Apply the database migrations:

```bash
npx prisma migrate dev
```

Seed the exercise and badge data:

```bash
npx prisma db seed
```

Start the development server:

```bash
npm run dev
```

By default, the Express server runs on port `3000` unless another `PORT` is supplied.

---

## Frontend Setup

Open another terminal:

```bash
cd front-end
```

Install dependencies:

```bash
npm install
```

Make sure the API base URL used by the mobile application points to the running backend.

Start Expo:

```bash
npm start
```

You can also start a specific target:

```bash
npm run android
npm run ios
npm run web
```

---

## Authentication & Security

The backend includes several security measures:

- Password hashing with `bcrypt`
- JWT-protected authenticated routes
- Request validation using Zod
- HTTP security headers using Helmet
- IP/request rate limiting
- Restricted file upload handling
- File-size validation for exercise videos
- Email verification and password-reset flows

---

## Exercise Analysis Pipeline

The push-up analysis workflow can be summarised as:

```text
Uploaded Video
      |
      v
Frame Extraction
      |
      v
Pose Estimation
      |
      v
Keypoint Normalisation
      |
      v
Push-up Detection
      |
      v
Rep Counting + Form Evaluation
      |
      v
Feedback Returned to Client
```

For each processed video, RepTrack extracts body keypoints including the shoulders, elbows, wrists, hips, knees, and ankles. These pose measurements are then used by the push-up counting logic to determine repetitions and provide feedback.

> **Current limitation:** automated exercise-form analysis currently supports push-ups only.

---

## Database Model

The main data model includes:

```text
User
├── WorkoutSession
│   └── WorkoutExercise
│       └── WorkoutSet
├── UserBadge
├── Thread
│   └── Reply
├── ThreadLike
└── ReplyLike

Exercise
Badge
EmailVerificationOtp
ForgotPasswordOtp
ForgotPasswordSession
```

This structure allows workout data, user progress, achievements, account functionality, and community activity to be managed through the same API.

---

## Development Scripts

### Backend

```bash
npm run dev
npm run build
npm start
```

### Frontend

```bash
npm start
npm run android
npm run ios
npm run web
```

---

## Current Scope

RepTrack is a development/academic project rather than a production fitness or medical system. Exercise-form feedback should not be treated as professional medical, physiotherapy, or coaching advice.

---

## Author

**Yani Ivanov Vasilev**

GitHub: [@yanivasilev](https://github.com/yanivasilev)

LinkedIn: [@yanivasilev](www.linkedin.com/in/yanivasilev)

---

## Possible Future Improvements

- Support AI form analysis for additional exercises
- Real-time camera-based exercise analysis
- Expanded training recommendations
- Automated backend and frontend tests
- CI/CD pipeline
- Cloud deployment
- Push notifications
- Social following/friend functionality
- Additional progress visualisations
