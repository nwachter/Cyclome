import type { Metadata } from "next";

export const metadata: Metadata = { title: "API Cyclôme : documentation" };

/*Documentaion API. interface Swagger est chargée depuis un CDN plutôt qu'installée en dépendance : le paquet React de Swagger embarque des bibliothèques encore bloquées à React 18, ce qui provoquait des conflits de résolution.  rendu identique.
 */
export default function ApiDocsPage() {
  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
      <div id="swagger-ui" />
      <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js" async />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('load', function () {
              window.SwaggerUIBundle({
                url: '/api/openapi',
                dom_id: '#swagger-ui',
                docExpansion: 'list',
              });
            });
          `,
        }}
      />
    </>
  );
}
