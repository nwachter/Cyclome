import { loginSchema, signupSchema, getPasswordScore } from "@/lib/validation/auth";

describe("loginSchema", () => {
  it("accepte un email et un mot de passe", () => {
    const result = loginSchema.safeParse({ email: "julien@example.fr", password: "x" });
    expect(result.success).toBe(true);
  });

  it("refuse un email mal forme", () => {
    const result = loginSchema.safeParse({ email: "julien", password: "x" });
    expect(result.success).toBe(false);
  });
});

describe("signupSchema", () => {
  const validInput = {
    firstname: "Julien",
    lastname: "Mercier",
    email: "julien@example.fr",
    phone: "0612345678",
    password: "MotDePasse2026",
    acceptTerms: true as const,
  };

  it("accepte une inscription complete", () => {
    expect(signupSchema.safeParse(validInput).success).toBe(true);
  });

  it("refuse un mot de passe trop court", () => {
    const result = signupSchema.safeParse({ ...validInput, password: "Court12" });
    expect(result.success).toBe(false);
  });

  it("refuse un mot de passe sans majuscule", () => {
    const result = signupSchema.safeParse({ ...validInput, password: "motdepasse2026" });
    expect(result.success).toBe(false);
  });

  it("refuse un mot de passe sans chiffre", () => {
    const result = signupSchema.safeParse({ ...validInput, password: "MotDePasseSansChiffre" });
    expect(result.success).toBe(false);
  });

  it("refuse si les conditions ne sont pas acceptees", () => {
    const result = signupSchema.safeParse({ ...validInput, acceptTerms: false });
    expect(result.success).toBe(false);
  });
});

describe("getPasswordScore", () => {
  it("monte avec la longueur et la variete", () => {
    expect(getPasswordScore("court")).toBe(0);
    expect(getPasswordScore("douzecaracter")).toBe(1);
    expect(getPasswordScore("DouzeCaracter")).toBe(2);
    expect(getPasswordScore("DouzeCaracte1")).toBe(3);
    expect(getPasswordScore("DouzeCaracte1!")).toBe(4);
  });
});
