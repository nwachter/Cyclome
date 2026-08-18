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

// Nos routes API renvoient toujours { message } en cas d'erreur.
// L'intercepteur remonte ce message pour que les composants n'aient pas
// a fouiller dans error.response.data a chaque fois.
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
