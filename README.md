# Concert Conjai Project

---

## Tech Stack

- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Backend**: NestJS + TypeScript + MongoDB

---

## Libraries / Packages

### Frontend (Next.js)

| Package               | Description                                           |
| --------------------- | ----------------------------------------------------- |
| **next**              | Framework สำหรับ React รองรับ SSR / Routing อัตโนมัติ      |
| **twailwind**         | CSS Framework                                         |
| **react / react-dom** | Core ของ React สำหรับสร้าง UI และ render DOM            |
| **lucide-react**      | ชุดไอคอนแบบ SVG ใช้งานง่ายใน React                       |
| **zustand**           | Lightweight state management ใช้แทน Redux หรือ Pinia    |


### Frontend (Next.js)

| Package                                                                       | Description                                                        |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **@nestjs/common / core / platform-express**                                  | Core module ของ NestJS สำหรับสร้าง controller, service, middleware |
| **@nestjs/config**                                                            | จัดการ environment variables (.env)                                |
| **@nestjs/mongoose**                                                          | ใช้เชื่อมต่อกับ MongoDB ผ่าน Mongoose                              |
| **mongoose**                                                                  | ODM สำหรับเชื่อมต่อ MongoDB                                        |
| **@nestjs/jwt / passport-jwt / passport-local / @nestjs/passport / passport** | ใช้สำหรับระบบ Authentication ด้วย JWT                              |
| **bcrypt**                                                                    | ใช้เข้ารหัส password ก่อนเก็บในฐานข้อมูล                           |
| **class-validator / class-transformer**                                       | สำหรับตรวจสอบความถูกต้องของข้อมูลใน DTO                            |
| **rxjs**                                                                      | ใช้ใน NestJS สำหรับจัดการ asynchronous stream                      |
| **reflect-metadata**                                                          | ใช้สำหรับ decorators ใน NestJS                                     |
| **@nestjs/mapped-types**                                                      | ใช้ในการแปลง DTO (Data Transfer Object)                            |

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
MONGO_URI=mongodb://localhost:27017/concertdb
FRONTEND_URL=http://localhost:3000
```
### 3.Run NestJS development server:

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
### 3.Run Next.js development server:

```bash
npm run dev
```




