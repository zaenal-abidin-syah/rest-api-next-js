import prisma from "@/lib/prismaClient";

export const createBook = async (data) => {
  let { title, author, publisher, isbn, published_year, stock } = data;
  console.log({ data });
  try {
    if (!title) {
      throw new Error("Missing required field: title");
    }
    if (!author) {
      throw new Error("Missing required field: author");
    }
    if (!stock) {
      throw new Error("Missing required field: stock");
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        publisher: publisher || undefined,
        isbn: isbn || undefined,
        published_year: published_year || undefined,
        stock,
      },
    });
    return book;
  } catch (error) {
    throw new Error("Error creating book");
  }
};
export const getBookById = async (id) => {
  try {
    const book = await prisma.book.findUnique({
      where: {
        id,
      },
    });

    if (!book) {
      throw new Error("Book not found");
    }
    return book;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllBooks = async () => {
  try {
    const books = await prisma.book.findMany();
    return books;
  } catch (error) {
    throw new Error("Error fetching books");
  }
};
export const updateBook = async (data, method = "PUT") => {
  try {
    // Ensure ID is provided
    console.log({ data });
    const { id, ...fields } = data;
    if (!id) throw new Error("Book ID is required.");

    let updates = {};

    if (method === "PUT") {
      // For PUT, require all fields
      const required = [
        "title",
        "author",
        "publisher",
        "isbn",
        "published_year",
        "stock",
      ];
      for (const field of required) {
        if (!(field in fields)) {
          throw new Error(`Missing required field for PUT: ${field}`);
        }
      }
      updates = fields;
    } else if (method === "PATCH") {
      // For PATCH, use only provided fields
      if (Object.keys(fields).length === 0) {
        throw new Error("No fields provided for PATCH.");
      }
      updates = fields;
    } else {
      throw new Error(`Unsupported method: ${method}`);
    }

    // Perform the update
    const updatedBook = await prisma.book.update({
      where: { id },
      data: updates,
    });

    return updatedBook;
  } catch (error) {
    // Rethrow with more context
    if (error.code === "P2025") {
      throw new Error(`Book with id ${data.id} not found.`);
    }
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    const book = await prisma.book.delete({
      where: {
        id,
      },
    });
    return book;
  } catch (error) {
    throw new Error("Book not found");
  }
};
