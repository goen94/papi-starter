import { db } from "@src/database/database";

export default async function teardown() {
  await db.collection("roles").deleteAll();
  await db.collection("users").deleteAll();
}
