# Movies Times Project

## Tech Stack

- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Backend**: NestJS + TypeScript + MongoDB

---

## Setup Backend (NestJS + MongoDB)

### 1.Enter to backend

```bash
cd backend
```

### 2.Install dependencies

```bash
npm install
```

### 3.Create file "/backend/.env" for environment variables:

```bash
PORT=5001
MONGO_URI=mongodb://localhost:27017/moviedb
FRONTEND_URL=http://localhost:3000
```
### 4.Run NestJS development server:

```bash
npm run start:dev
```

---

## Setup Frontend

### 1.Enter to frontend

```bash
cd frontend
```

### 2.install dependencies

```bash
npm install
```

### 3.Create file "/frontend/.env" for environment variables:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5001
```
### 4.Run Next.js development server:

```bash
npm run dev
```

## Running Unit Tests

### Enter to backend

```bash
cd backend
```

---

### Run Unit Tests

NestJS uses Jest for testing. To run all unit tests:

```bash
npm run test
```

To run tests in watch mode (auto-re-run when files change):

```bash
npm run test
```

To run tests with code coverage:

```bash
npm run test:coverage
```

