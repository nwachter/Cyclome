import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
    coverageProvider: "v8",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
    testMatch: ["<rootDir>/tests/unit/**/*.test.ts?(x)"],
    collectCoverageFrom: ["src/lib/**/*.ts", "src/components/**/*.tsx"],
    coverageThreshold: { global: { statements: 70, branches: 60, functions: 70, lines: 70 } },
};

export default createJestConfig(config);