# Auth Express Teaching Demo

This project now includes:

- JWT auth with HTTP-only cookies
- controller-based Express routes
- profile photo upload with `multer`
- Cloudinary image hosting
- role-based access control
- a simple React frontend using `axios`

## Backend setup

Install dependencies:

```bash
npm install
```

Create a `.env` file from `.env.example`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_this_with_a_long_random_secret
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend:

```bash
npm run dev
```

## Frontend setup

Move into the React app:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file from `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The React app runs on `http://localhost:5173`.

## Main backend routes

### Auth routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PUT /api/auth/profile`

`PUT /api/auth/profile` accepts `multipart/form-data` with:

- `name`
- `bio`
- `role`
- `profileImage`

### Role demo routes

- `GET /api/auth/student-area`
- `GET /api/auth/teacher-area`
- `GET /api/auth/admin-area`

Access rules:

- `student-area`: any logged-in user
- `teacher-area`: `teacher` or `admin`
- `admin-area`: `admin` only

### Item routes

- `POST /api/items`
- `GET /api/items`
- `GET /api/items/:id`
- `DELETE /api/items/:id`

## Beginner notes

- `multer` reads the uploaded image from the request body before the controller handles it.
- The file is kept in memory first, then sent to Cloudinary, which is why the upload code feels a little more involved than a normal text form.
- The auth flow is: client sends login/signup data -> backend validates it -> backend creates or finds the user -> a cookie is set -> the frontend uses that cookie for future requests.
- The JWT is stored in a cookie named `token`.
- `axios` uses `withCredentials: true`, which helps avoid common cookie/CORS mistakes.
- CORS is configured in the backend using `CLIENT_URL`.

## How the photo upload works

1. The frontend sends a form that includes text fields and a file.
2. The route uses `upload.single("profileImage")`, which tells multer to look for a file field named `profileImage`.
3. Multer reads that file and makes it available to the controller as `req.file`.
4. The controller sends the file to Cloudinary and stores the returned image URL in the database.
5. The user can later update or replace that photo using the same flow.

## Note

This project allows users to choose a role from the frontend so the protected routes are easy to test.

In a real production app, sensitive roles like `admin` should not be assigned directly by normal users.
