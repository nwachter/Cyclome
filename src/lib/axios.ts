import axios from "axios";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// routes API renvoie  { message } en cas d'erreur, récupéré ici

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message ?? "Une erreur est survenue";
      const status = error.response?.status ?? 0;
      return Promise.reject(new ApiError(message, status));
    }
    return Promise.reject(error);
  },
);
