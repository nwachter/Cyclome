import { createSwaggerSpec } from "next-swagger-doc";

/* Document OpenAPI construit à partir des commentaires @swagger placés dans src/app/api. api : /api/openapi */
//affiché sur /api-docs.
export function getOpenApiSpec() {
  return createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API Cyclôme",
        version: "1.0.0",
        description:
          "Réservation d'interventions à domicile : zones, créneaux, forfaits, interventions.",
      },
      servers: [{ url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000" }],
      components: {
        securitySchemes: {
          sessionCookie: { type: "apiKey", in: "cookie", name: "cyclome.session_token" },
        },
      },
    },
  });
}
