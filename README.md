# Simple JWT Auth With Express and MongoDB

This project shows:

- user signup
- user login
- JWT stored in an HTTP-only cookie
- protected route with middleware
- simple MongoDB operations: add, find, delete

## 1. Install

```bash
npm install
```

## 2. Add your environment variables

Create a `.env` file and copy this:

```env
PORT=5000
MONGO_URI=mongodb+srv://your-username:your-password@cluster-name.mongodb.net/jwtAuthDemo?retryWrites=true&w=majority
JWT_SECRET=replace_this_with_a_long_random_secret
NODE_ENV=development
```

Use your MongoDB Atlas connection string in `MONGO_URI`.

## 3. Run the server

```bash
npm run dev
```

or

```bash
npm start
```

## 4. API endpoints

### Auth

#### Signup

`POST /api/auth/signup`

```json
{
  "name": "Ayush",
  "email": "ayush@example.com",
  "password": "123456"
}
```

#### Login

`POST /api/auth/login`

```json
{
  "email": "ayush@example.com",
  "password": "123456"
}
```

#### Logout

`POST /api/auth/logout`

#### Get current user

`GET /api/auth/me`

This works only if the JWT cookie is present.

### Item routes

These are protected routes. Login first so the cookie is set.

#### Add item

`POST /api/items`

```json
{
  "title": "Learn JWT",
  "description": "Store token in cookie"
}
```

#### Find all items

`GET /api/items`

#### Find one item

`GET /api/items/:id`

#### Delete item

`DELETE /api/items/:id`

## 5. Mongo operations used in this project

This project uses Mongoose, which is the most common way to work with MongoDB in Express apps.

### Add data

```js
const user = await User.create({
  name,
  email,
  password: hashedPassword
});

const item = await Item.create({
  title,
  description,
  user: req.user._id
});
```

### Find one document

```js
const user = await User.findOne({ email });
```

```js
const item = await Item.findOne({
  _id: req.params.id,
  user: req.user._id
});
```

### Find many documents

```js
const items = await Item.find({ user: req.user._id });
```

### Delete one document

```js
const item = await Item.findOneAndDelete({
  _id: req.params.id,
  user: req.user._id
});
```

## 6. Basic MongoDB shell syntax

If you want the plain MongoDB syntax also, here are the basic commands:

### Insert

```js
db.items.insertOne({
  title: "Learn JWT",
  description: "Store token in cookie"
});
```

### Find all

```js
db.items.find({});
```

### Find one

```js
db.items.findOne({ title: "Learn JWT" });
```

### Delete one

```js
db.items.deleteOne({ title: "Learn JWT" });
```

## 7. Notes

- JWT is stored in a cookie named `token`
- the cookie is `httpOnly`, so JavaScript in the browser cannot read it
- `secure` becomes `true` in production
- each item belongs to the logged-in user
