import { json } from '@sveltejs/kit';

// Swagger/OpenAPI specification
const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Cyclone API',
    description: 'API for Cyclone package management system',
    version: '1.0.0',
    contact: {
      name: 'Cyclone Support',
      url: 'https://tally.so/r/mVXylJ'
    }
  },
  servers: [
    {
      url: 'https://your-vercel-app.vercel.app',
      description: 'Production server'
    },
    {
      url: 'http://localhost:5173',
      description: 'Development server'
    }
  ],
  paths: {
    '/api/links': {
      get: {
        summary: 'Get social links',
        description: 'Returns social media and support links for Cyclone',
        responses: {
          200: {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    discord: { type: 'string', example: 'https://discord.gg/UYgGdEwGsK' },
                    docs: { type: 'string', example: 'https://cyclone.fibery.io/@public' },
                    suggestions: { type: 'string', example: 'https://tally.so/r/mVXylJ' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/versions': {
      get: {
        summary: 'Get version information',
        description: 'Returns available Cyclone versions and their build numbers',
        responses: {
          200: {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  additionalProperties: { type: 'string' },
                  example: {
                    '0.0.1': '50425',
                    'latest (2.2.0)': '55349'
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/packages': {
      get: {
        summary: 'List packages',
        description: 'Get a list of packages with optional filtering',
        parameters: [
          {
            name: 'name',
            in: 'query',
            description: 'Filter packages by name (case-insensitive)',
            schema: { type: 'string' }
          },
          {
            name: 'rhid',
            in: 'query',
            description: 'Filter packages by RHID',
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      _id: { type: 'string' },
                      name: { type: 'string' },
                      description: { type: 'string' },
                      rhid: { type: 'integer' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create package',
        description: 'Create a new package',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'description', 'rhid', 'edit_code'],
                properties: {
                  name: { type: 'string', example: 'My Package' },
                  description: { type: 'string', example: 'A useful package' },
                  rhid: { type: 'integer', example: 12345 },
                  edit_code: { type: 'string', example: 'secret123' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Package created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                    rhid: { type: 'integer' }
                  }
                }
              }
            }
          },
          409: {
            description: 'Package name or RHID already exists'
          }
        }
      }
    },
    '/api/packages/{rhid}': {
      put: {
        summary: 'Update package',
        description: 'Update an existing package',
        parameters: [
          {
            name: 'rhid',
            in: 'path',
            required: true,
            description: 'Package RHID',
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['edit_code'],
                properties: {
                  edit_code: { type: 'string', example: 'secret123' },
                  name: { type: 'string', example: 'Updated Package Name' },
                  description: { type: 'string', example: 'Updated description' },
                  rhid: { type: 'integer', example: 12346 }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Package updated successfully'
          },
          403: {
            description: 'Invalid edit code'
          },
          404: {
            description: 'Package not found'
          }
        }
      }
    }
  }
};

export async function GET() {
  return json(swaggerSpec, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}