import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@gmail.com";
  const password = "123456";
  const name = "Super Admin";

  const existingSuperAdmin = await prisma.user.findFirst({
    where: {
      role: "SUPER_ADMIN",
    },
  });

  if (existingSuperAdmin) return;

  const hashedPassword = await bcrypt.hash(password, 10);

  const superAdmin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: "SUPER_ADMIN",
    },
  });

  console.log("Super admin created successfully", superAdmin.email);
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
