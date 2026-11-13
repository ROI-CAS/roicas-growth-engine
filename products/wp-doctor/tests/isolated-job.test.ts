import { describe, expect, it } from "vitest";
import {
  authorized,
  jobContract,
} from "../packages/isolated-runner/job-contract";
const id = "12345678-1234-4234-8234-123456789abc";
describe("Contrato del controlador aislado", () => {
  it("solo admite una portada HTTPS y un UUID", () => {
    expect(
      jobContract({ job_id: id, target: "https://doctor.roicas.com/" }),
    ).toEqual({ job_id: id, target: "https://doctor.roicas.com/" });
  });
  it.each([
    { job_id: "../../socket", target: "https://doctor.roicas.com/" },
    { job_id: id, target: "http://doctor.roicas.com/" },
    { job_id: id, target: "https://doctor.roicas.com/wp-admin/" },
    { job_id: id, target: "https://127.0.0.1/" },
    { job_id: id, target: "https://doctor.roicas.com/", image: "other" },
    { job_id: id, target: "https://doctor.roicas.com/?run=1" },
  ])("rechaza rutas, parámetros de ejecución y campos adicionales", (input) => {
    expect(() => jobContract(input)).toThrow();
  });
  it("requiere coincidencia completa del secreto", () => {
    const secret = "a".repeat(64);
    expect(authorized(`Bearer ${secret}`, secret)).toBe(true);
    expect(authorized(undefined, secret)).toBe(false);
    expect(authorized(`Bearer ${secret}b`, secret)).toBe(false);
    expect(authorized(`Bearer ${"b".repeat(64)}`, secret)).toBe(false);
  });
});
