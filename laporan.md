> **Nama : Zaenal Abidin Syah**  
> **Nim : 210411100186**  
> **Matakuliah : Pengembangan Aplikasi Terintegrasi A**

<br>
<br>
<br>

# API Dokumentasi

## 1. Deskripsi Proyek

Membangun REST API sederhana untuk manajemen buku dan peminjaman, dengan fitur CRUD pada resource books dan loans, ditambah endpoint untuk registrasi (/signup) dan otentikasi (/getauthtoken).

## 2. Teknologi & Framework

- Framework: Next.js (Framework serverless)
- Bahasa: JavaScript (ESM)
- Database: MySQL via Prisma ORM
- Validasi Input: Zod
- Autentikasi: JWT (jsonwebtoken)
- Deployment: Netlify Functions

## 3. Struktur Folder

```
app/
└─ api/
   └─ v1/
      ├─ books/
      │  ├─ route.js
      │  └─ [id]/route.js
      ├─ loans/
      │  ├─ route.js
      │  └─ [id]/route.js
      ├─ getauthtoken/route.js
      └─ signup/route.js

utils/
└─ dbUtils/
   ├─ user.js
   ├─ book.js
   └─ loan.js
└─ tokenUtils/
   ├─ getToken.js
   └─ validateToken.js

lib/
└─ prismaClient.js

.env
```

## 4. Endpoint API

> Base URL: https://pinjamanbuku.netlify.app/api/v1

### 4.1 User Management

#### POST /signup

- Fungsi: Registrasi user baru
- Validasi: Zod schema (email, password minimal 8 karakter dengan uppercase, lowercase, angka; username 3-20 karakter)
- Kode (ringkas):

```js
// app/api/v1/signup/route.js
const createUserSchema = z
  .object({
    /* ... */
  })
  .strict();
export const POST = async (req) => {
  const data = await req.json();
  createUserSchema.parse(data);
  const user = await createUser(data);
  return NextResponse.json(
    { message: "User created successfully", data: user },
    { status: 201 }
  );
};
```

- Screenshot Postman
  _(gambar saja – tangkapan layar response 201 dan body)_
  ![Screenshot Postman](gambar-signup.png)

#### GET /getauthtoken

- Fungsi: Generate JWT token
- Header: Authorization: Basic base64(email:password)
- Kode (ringkas):

```js
// app/api/v1/getauthtoken/route.js
export const GET = async (req) => {
  const basic = req.headers.get("Authorization").split(" ")[1];
  const [email, pwd] = Buffer.from(basic, "base64").toString().split(":");
  const token = await generateToken(email, pwd);
  return NextResponse.json(
    { message: "Token generated successfully", token },
    { status: 200 }
  );
};
```

- Screenshot Postman
  _(gambar saja – tangkapan layar token di response)_
  ![Screenshot Postman](gambar-getauthtoken.png)

### 4.2 Books

#### GET /books

- Fungsi: Ambil daftar semua buku
- Keamanan: Header Authorization: Bearer {token}
- Kode (ringkas):

```js
// app/api/v1/books/route.js
export const GET = async (req) => {
  const token = req.headers.get("Authorization").split(" ")[1];
  validateToken(token);
  const data = await getAllBooks();
  return NextResponse.json(
    { message: "successfully get all books", data },
    { status: 200 }
  );
};
```

- Screenshot Postman
  ![Screenshot Postman](gambar-get-books.png)

#### POST /books

- Fungsi: Tambah buku baru
- Validasi: Zod bisa ditambahkan (saat ini validasi manual di createBook)
- Kode (ringkas):

```js
export const POST = async (req) => {
  const token = req.headers.get("Authorization").split(" ")[1];
  validateToken(token);
  const payload = await req.json();
  await createBook(payload);
  return NextResponse.json(
    { message: "create books successfully" },
    { status: 200 }
  );
};
```

- Screenshot Postman
  ![Screenshot Postman](gambar-post-books.png)

#### GET /books/[id]

- Fungsi: Ambil detail buku berdasarkan ID
- Kode (ringkas):

```js
// app/api/v1/books/[id]/route.js
export const GET = async (req, { params }) => {
  validateToken(req.headers.get("Authorization").split(" ")[1]);
  const id = parseInt(params.id);
  const data = await getBookById(id);
  return NextResponse.json(
    { message: "get book by id", data },
    { status: 200 }
  );
};
```

- Screenshot Postman
  ![Screenshot Postman](gambar-get-book-id.png)

#### PUT /books/[id] & PATCH /books/[id]

- Fungsi: Update buku (PUT = full update, PATCH = partial)
- Kode (ringkas):

```js
export const PUT = async (req, {params}) => {
  validateToken(...);
  const payload = await req.json();
  payload.id = parseInt(params.id);
  const result = await updateBook(payload, "PUT");
  return NextResponse.json({ message: "update books successfully", result }, { status: 200 });
};
```

- Screenshot Postman
  ![Screenshot Postman](gambar-put-book.png)

#### DELETE /books/[id]

- Fungsi: Hapus buku
- Kode (ringkas):

```js
export const DELETE = async (req, {params}) => {
  validateToken(...);
  const id = parseInt(params.id);
  await deleteBook(id);
  return NextResponse.json({ message: "delete books successfully" }, { status: 200 });
};
```

- Screenshot Postman
  ![Screenshot Postman](gambar-delete-book.png)

### 4.3 Loans

#### GET /loans & POST /loans

- GET: Daftar semua peminjaman
- POST: Buat peminjaman baru (otomatis set due_date +3 hari)
- Kode (ringkas):

```js
// GET
export const GET = async (req) => {
  validateToken(...);
  const data = await getAllLoans();
  return NextResponse.json({ message: "...", data }, { status: 200 });
};

// POST
export const POST = async (req) => {
  const token = req.headers.get("Authorization").split(" ")[1];
  const decoded = validateToken(token);
  let payload = await req.json();
  payload.user_id = (await getUserByEmail(decoded.email)).id;
  await createLoan(payload);
  return NextResponse.json({ message: "create loans successfully" }, { status: 200 });
};
```

- Screenshot Postman
  ![Screenshot Postman](gambar-post-loans.png)

#### GET /loans/[id], PATCH /loans/[id], DELETE /loans/[id]

- Fungsi: Detail, update status menjadi returned, dan hapus peminjaman
- Kode (ringkas):

```js
// PATCH
export const PATCH = async (req, {params}) => {
  validateToken(...);
  const id = parseInt(params.id);
  await updateLoans({ id });
  return NextResponse.json({ message: "update loans successfully" }, { status: 200 });
};
```

- Screenshot Postman
  ![Screenshot Postman](gambar-patch-loans.png)

## 5. Mekanisme Keamanan

1. JWT Authentication: Semua endpoint kecuali /signup dan /getauthtoken wajib menyertakan header Authorization: Bearer {token} dan token divalidasi di setiap function.
2. Validasi Input:

   - Zod pada /signup untuk schema user.
   - Manual checks di createBook, createLoan untuk memastikan field wajib ada.

## 6. Deployment di Netlify

- Proses:

  1. Push repository ke GitHub.
  2. Hubungkan ke Netlify, pilih framework Next.js.
  3. Netlify otomatis mendeteksi Serverless Functions di app/api.

- Masalah:

  - Tidak bisa debug langsung—error di function tidak terlihat live, hanya dari log build.
  - Beberapa method JS tidak didukung (contoh: String.prototype.split pada header parsing, perlu polyfill).
  - Prisma perlu build binary yang sesuai, kadang gagal di environment serverless, memaksa konfigurasi custom.

## 7. Perbandingan Pengalaman Deploy vs Hosting Lokal

| Aspek                  | Hosting Lokal                    | Netlify (Serverless)                                      |
| ---------------------- | -------------------------------- | --------------------------------------------------------- |
| Konfigurasi awal       | Mudah: npm run dev, direct logs  | Perlu setup project, environment vars, dan Netlify CLI    |
| Debugging              | Langsung di terminal, VSCode dev | Terbatas: hanya lewat Netlify build logs                  |
| Performance cold start | N/A                              | Ada delays saat function belum “warm”                     |
| Dependensi khusus      | Semua langsung terinstall        | Beberapa built-in method / Prisma perlu konfigurasi extra |
| URL & SSL              | Manual (ngrok/localhost)         | Otomatis HTTPS & URL production                           |

## 8. Kesimpulan

- Local: Cepat setup dan mudah debug, namun tidak public.
- Serverless: Public & auto-scale, tapi memerlukan konfigurasi tambahan dan debugging lebih sulit di fungsi edge.

## 9. URL Endpoint Aktif

> [https://pinjamanbuku.netlify.app/api/v1](https://pinjamanbuku.netlify.app/api/v1)
