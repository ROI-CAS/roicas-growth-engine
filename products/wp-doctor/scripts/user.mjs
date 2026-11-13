import { z } from "zod";
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
const email = z.email().parse(process.argv[2]).toLowerCase();
const role = z
  .enum(["owner", "commercial", "technician"])
  .parse(process.argv[3]);
const quote = (value) => `'${value.replaceAll("'", "''")}'`;
await mkdir(".cache", { recursive: true });
await writeFile(
  ".cache/user.sql",
  `INSERT INTO users(id,email,role) VALUES (${quote(randomUUID())},${quote(email)},${quote(role)}) ON CONFLICT(email) DO UPDATE SET role=excluded.role,active=1;\n`,
);
console.log(
  "SQL preparado en .cache/user.sql. Revisar y aplicar al D1 del entorno correcto. No se modificó ninguna cuenta.",
);
