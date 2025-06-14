const PASSED = "Passed";
const FAILED = "Failed";

export const statusConfig = {
  Passed: PASSED,
  Failed: FAILED,
} as const;

export const fileProcessConfig = {
  PROCESSING: "PROCESSING",
  VALIDATING: "VALIDATING",
  VALIDATED: "VALIDATED",
};
