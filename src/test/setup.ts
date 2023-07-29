import { hash } from "argon2";
import { db } from "@src/database/database";

export default async function setup() {
  const adminRole = await db.collection("roles").create({
    name: "admin",
    permissions: ["bank.view", "bank.create", "bank.update", "bank.delete"],
  });
  const userRole = await db.collection("roles").create({
    name: "user",
    permissions: [],
  });

  await db.collection("users").create({
    username: "user",
    email: "user@example.com",
    password: await hash("user2023"),
    name: "User",
    role_id: userRole._id,
  });

  await db.collection("users").create({
    username: "admin",
    email: "admin@example.com",
    password: await hash("admin2023"),
    name: "Admin",
    role_id: adminRole._id,
  });

  await db.collection("users").create({
    username: "approver",
    email: "approver@example.com",
    password: await hash("approver2023"),
    name: "Approver",
    role_id: adminRole._id,
  });
}
