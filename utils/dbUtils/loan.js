import prisma from "@/lib/prismaClient";

export const createLoan = async (data) => {
  let { book_id, user_id } = data;
  try {
    if (!user_id) {
      throw new Error("Missing required field: user_id");
    }
    if (!book_id) {
      throw new Error("Missing required field: book_id)");
    }
    const timestampInSeconds = Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60; // 3 hari dari sekarang
    const dateFromSeconds = new Date(timestampInSeconds * 1000);

    const loan = await prisma.loan.create({
      data: {
        book_id,
        user_id,
        due_date: dateFromSeconds,
      },
    });
    return loan;
  } catch (error) {
    throw new Error("Error creating loan");
  }
};
export const getLoanById = async (id) => {
  try {
    const loan = await prisma.loan.findUnique({
      where: {
        id,
      },
    });

    if (!loan) {
      throw new Error("Loan not found");
    }
    return loan;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllLoans = async () => {
  try {
    const loans = await prisma.loan.findMany();
    return loans;
  } catch (error) {
    throw new Error("Error fetching loans");
  }
};
export const updateLoans = async (data) => {
  try {
    // Ensure ID is provided
    const { id, ...fields } = data;
    if (!id) throw new Error("Loan ID is required.");
    const dateNow = new Date();

    let updates = {};
    if (Object.keys(fields).length === 0) {
      throw new Error("No fields provided for PATCH.");
    }
    updates = fields;
    updates.return_date = dateNow;
    updates.status = "returned";

    // Perform the update
    console.log({ updates });
    const loan = await prisma.loan.update({
      where: { id },
      data: updates,
    });

    return loan;
  } catch (error) {
    // Rethrow with more context
    if (error.code === "P2025") {
      throw new Error(`Loans with id ${data.id} not found.`);
    }
    throw error;
  }
};
export const deleteLoans = async (id) => {
  try {
    const loan = await prisma.loan.delete({
      where: {
        id,
      },
    });
    return loan;
  } catch (error) {
    throw new Error("Loan not found");
  }
};
