import { timingSafeEqual } from "node:crypto";
import { targetHomepage, PolicyError } from "../runner/policy";

export function authorized(
  header: string | undefined,
  secret: string,
): boolean {
  const supplied = Buffer.from(header ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return (
    supplied.length === expected.length && timingSafeEqual(supplied, expected)
  );
}

export function jobContract(input: unknown): {
  job_id: string;
  target: string;
} {
  if (!input || typeof input !== "object")
    throw new PolicyError("invalid_contract");
  const value = input as Record<string, unknown>;
  if (Object.keys(value).some((key) => !["job_id", "target"].includes(key)))
    throw new PolicyError("invalid_contract");
  if (
    typeof value.job_id !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value.job_id,
    ) ||
    typeof value.target !== "string"
  )
    throw new PolicyError("invalid_contract");
  const target = targetHomepage(value.target, [new URL(value.target).hostname]);
  return { job_id: value.job_id, target };
}
