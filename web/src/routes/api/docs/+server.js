/**
 * GET /api/docs
 * Returns Swagger UI with Cyclone API documentation
 * @returns {Promise<Response>} HTML response with Swagger UI
 */
export async function GET() {
  const openApiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Cyclone API',
      version: '1.0.0',
      description: 'API for Cyclone package manager'
    },
    servers: [
      {
        url: 'http://localhost:5173',
      },
      {
        url: 'https://cyclonelib.pages.dev',
      }
    ],
    paths: {
      '/api/links': {
        get: {
          summary: 'Get project links',
          description: 'Retrieves a list of useful links for the Cyclone project.',
          responses: {
            200: {
              description: 'JSON response containing links object with CORS headers'
            }
          }
        }
      },
      '/api/packages': {
        post: {
          summary: 'Create package',
          description: 'Creates a new package in the database.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', description: 'Package name' },
                    short_description: { type: 'string', description: 'Short description' },
                    long_description: { type: 'string', description: 'Long description' },
                    edit_code: { type: 'string', description: 'Edit code for authentication' }
                  },
                  required: ['name', 'edit_code']
                }
              }
            }
          },
          responses: {
            201: { description: 'Created package data' },
            400: { description: 'Validation error' },
            409: { description: 'Package name already taken' }
          }
        }
      },
      '/api/packages/{name}': {
        get: {
          summary: 'Get package',
          description: 'Retrieves a specific package by name.',
          parameters: [
            {
              name: 'name',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Package name'
            }
          ],
          responses: {
            200: { description: 'Package data' },
            404: { description: 'Package not found' }
          }
        },
        patch: {
          summary: 'Update package',
          description: 'Updates an existing package.',
          parameters: [
            {
              name: 'name',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Package name'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    edit_code: { type: 'string', description: 'Edit code for authentication' },
                    name: { type: 'string', description: 'New package name' },
                    short_description: { type: 'string', description: 'Short description' },
                    long_description: { type: 'string', description: 'Long description' },
                    download_url: { type: 'string', description: 'Download URL' }
                  },
                  required: ['edit_code']
                }
              }
            }
          },
          responses: {
            200: { description: 'Updated package data' },
            403: { description: 'Invalid edit code' },
            404: { description: 'Package not found' }
          }
        },
        delete: {
          summary: 'Delete package',
          description: 'Deletes a package.',
          parameters: [
            {
              name: 'name',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Package name'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    edit_code: { type: 'string', description: 'Edit code for authentication' }
                  },
                  required: ['edit_code']
                }
              }
            }
          },
          responses: {
            200: { description: 'Deleted package data' },
            403: { description: 'Invalid edit code' },
            404: { description: 'Package not found' }
          }
        }
      },
      '/api/packages/{name}/versions': {
        get: {
          summary: 'List package versions',
          description: 'Retrieves all versions for a specific package.',
          parameters: [
            {
              name: 'name',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Package name'
            }
          ],
          responses: {
            200: { description: 'Array of version data' }
          }
        },
        post: {
          summary: 'Create version',
          description: 'Creates a new version for a package.',
          parameters: [
            {
              name: 'name',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Package name'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    version_number: { type: 'string', description: 'Version number' },
                    patch_notes: { type: 'string', description: 'Patch notes' },
                    download_url: { type: 'string', description: 'Download URL' },
                    edit_code: { type: 'string', description: 'Edit code for authentication' }
                  },
                  required: ['version_number', 'download_url', 'edit_code']
                }
              }
            }
          },
          responses: {
            201: { description: 'Created version data' },
            403: { description: 'Invalid edit code' },
            404: { description: 'Package not found' },
            409: { description: 'Version already exists' }
          }
        }
      },
      '/api/packages/{name}/versions/{version}': {
        get: {
          summary: 'Get version',
          description: 'Retrieves a specific version of a package. Use /versions/latest to get the latest version.',
          parameters: [
            {
              name: 'name',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Package name'
            },
            {
              name: 'version',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Version number'
            }
          ],
          responses: {
            200: { description: 'Version data' },
            404: { description: 'Version not found' }
          }
        },
        patch: {
          summary: 'Update version',
          description: 'Updates a specific version of a package.',
          parameters: [
            {
              name: 'name',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Package name'
            },
            {
              name: 'version',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Version number'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    version_number: { type: 'string', description: 'New version number' },
                    patch_notes: { type: 'string', description: 'Patch notes' },
                    download_url: { type: 'string', description: 'Download URL' },
                    edit_code: { type: 'string', description: 'Edit code for authentication' }
                  },
                  required: ['edit_code']
                }
              }
            }
          },
          responses: {
            200: { description: 'Updated version data' },
            403: { description: 'Invalid edit code' },
            404: { description: 'Version not found' }
          }
        }
      },
      '/api/versions': {
        get: {
          summary: 'Get Cyclone versions',
          description: 'Retrieves available Cyclone versions with their routinehub version ids.',
          responses: {
            200: { description: 'JSON response with versions object and CORS headers' }
          }
        }
      }
    }
  };

  const swaggerHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Cyclone API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui.css" />
  <style>
    html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin: 0; background: #fafafa; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        spec: ${JSON.stringify(openApiSpec)},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.presets.standalone
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>`;

  return new Response(swaggerHtml, {
    headers: {
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*'
    }
  });
}