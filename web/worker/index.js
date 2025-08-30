import { connectDB, serializeDoc, hashEditCode } from '../functions/api/_utils.js';

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
      url: 'https://cyclone-api.your-subdomain.workers.dev',
      description: 'Production server'
    },
    {
      url: 'http://localhost:8787',
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

// Links endpoint
async function handleLinks(request) {
  const links = { "discord": "https://discord.gg/UYgGdEwGsK", "docs": "https://cyclone.fibery.io/@public", "suggestions": "https://tally.so/r/mVXylJ" };
  return new Response(JSON.stringify(links), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

// Versions endpoint
async function handleVersions(request) {
  const versions = { "0.0.1": "50425", "0.1.1": "50478", "0.2.2": "50707", "1.2.5": "50844", "2.0.0": "54390", "2.0.1": "54408", "2.0.2": "54423", "2.1.2": "54441", "2.1.7": "54482", "2.2.0": "55349", "latest (2.2.0)": "55349" };
  return new Response(JSON.stringify(versions), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

// GET /api/packages - List packages
async function handleGetPackages(request, env) {
  // Check if MONGO_URI is available in Cloudflare env
  if (!env.MONGO_URI) {
    return new Response(JSON.stringify({
      error: 'Database configuration missing',
      message: 'MONGO_URI environment variable not set. Please check your .dev.vars file or Wrangler secrets.'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  try {
    // Set the environment variable for the connectDB function
    process.env.MONGO_URI = env.MONGO_URI;

    const url = new URL(request.url);
    const name = url.searchParams.get('name');
    const rhid = url.searchParams.get('rhid');

    const db = await connectDB(env.MONGO_URI);
    const query = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (rhid) query.rhid = { $regex: rhid, $options: 'i' };

    // Add timeout to prevent hanging
    const docs = await Promise.race([
      db.collection('packages').find(query).limit(100).toArray(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database query timeout')), 30000)
      )
    ]);

    const result = docs.map(doc => serializeDoc(doc, ['edit_code']));
    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error) {
    console.error('Database error in handleGetPackages:', error);
    return new Response(JSON.stringify({
      error: 'Database error',
      message: 'Failed to fetch packages from database',
      details: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }
}

// POST /api/packages - Create package
async function handleCreatePackage(request, env) {
  if (!env.MONGO_URI) {
    return new Response(JSON.stringify({
      error: 'Database configuration missing',
      message: 'MONGO_URI environment variable not set'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  process.env.MONGO_URI = env.MONGO_URI;
  const { edit_code, name, description, rhid } = await request.json();
  const packageDict = { name, description, rhid, edit_code: hashEditCode(edit_code) };

  const db = await connectDB(env.MONGO_URI);

  // Check for existing name
  const existingName = await db.collection('packages').findOne({ name });
  if (existingName) {
    return new Response(JSON.stringify({ detail: 'Package name is already taken' }), {
      status: 409,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  // Check for existing rhid
  const existingRhid = await db.collection('packages').findOne({ rhid });
  if (existingRhid) {
    return new Response(JSON.stringify({ detail: 'Package RHID is already taken. If someone has uploaded your package here and you want it removed, please [contact us](https://tally.so/r/mVXylJ). Support is checked regularly.' }), {
      status: 409,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  const result = await db.collection('packages').insertOne(packageDict);
  const created = await db.collection('packages').findOne({ _id: result.insertedId });

  return new Response(JSON.stringify(serializeDoc(created)), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

// PUT /api/packages/:rhid - Edit package
async function handleEditPackage(request, env, rhid) {
  if (!env.MONGO_URI) {
    return new Response(JSON.stringify({
      error: 'Database configuration missing',
      message: 'MONGO_URI environment variable not set'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  process.env.MONGO_URI = env.MONGO_URI;
  const { edit_code, name, description, rhid: newRhid } = await request.json();

  const db = await connectDB(env.MONGO_URI);
  const existingPackage = await db.collection('packages').findOne({ rhid: parseInt(rhid) });

  if (!existingPackage) {
    return new Response(JSON.stringify({ detail: 'Package not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  if (existingPackage.edit_code !== hashEditCode(edit_code.trim())) {
    return new Response(JSON.stringify({ detail: 'Edit code does not match' }), {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  const updateFields = {};
  if (name !== undefined && name !== existingPackage.name) {
    const existingName = await db.collection('packages').findOne({ name, _id: { $ne: existingPackage._id } });
    if (existingName) {
      return new Response(JSON.stringify({ detail: 'Package name is already taken' }), {
        status: 409,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }
    updateFields.name = name;
  }
  if (description !== undefined) updateFields.description = description;
  if (newRhid !== undefined && newRhid !== existingPackage.rhid) {
    const existingRhidCheck = await db.collection('packages').findOne({ rhid: newRhid, _id: { $ne: existingPackage._id } });
    if (existingRhidCheck) {
      return new Response(JSON.stringify({ detail: 'Package RHID is already taken. If someone has uploaded your package here and you want it removed, please [contact us](https://tally.so/r/mVXylJ). Support is checked regularly.' }), {
        status: 409,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }
    updateFields.rhid = newRhid;
  }

  if (Object.keys(updateFields).length === 0) {
    return new Response(JSON.stringify(serializeDoc(existingPackage, ['edit_code'])), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  await db.collection('packages').updateOne({ _id: existingPackage._id }, { $set: updateFields });
  const updated = await db.collection('packages').findOne({ _id: existingPackage._id });
  return new Response(JSON.stringify(serializeDoc(updated, ['edit_code'])), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

// Serve SwaggerUI
async function handleSwaggerUI(request) {
  const url = new URL(request.url);

  // Serve OpenAPI spec
  if (url.pathname === '/api/docs/json') {
    return new Response(JSON.stringify(swaggerSpec), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  // Serve SwaggerUI HTML
  if (url.pathname === '/api/docs' || url.pathname === '/api/docs/') {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Cyclone API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.7.2/swagger-ui.css" />
  <style>
    html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin: 0; background: #fafafa; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.7.2/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.7.2/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: '/api/docs/json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>`;
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  return null;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Cloudflare Worker export
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const method = request.method;

    // Handle CORS preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    try {
      let response;

      // Handle SwaggerUI routes first
      if (url.pathname.startsWith('/api/docs')) {
        response = await handleSwaggerUI(request);
        if (response) return response;
      }

      // Route API requests to appropriate handlers
      if (url.pathname === '/api/links' && method === 'GET') {
        response = await handleLinks(request);
      } else if (url.pathname === '/api/versions' && method === 'GET') {
        response = await handleVersions(request);
      } else if (url.pathname === '/api/packages' && method === 'GET') {
        response = await handleGetPackages(request, env);
      } else if (url.pathname === '/api/packages' && method === 'POST') {
        response = await handleCreatePackage(request, env);
      } else if (url.pathname.match(/^\/api\/packages\/\d+$/) && method === 'PUT') {
        const rhid = url.pathname.split('/').pop();
        response = await handleEditPackage(request, env, rhid);
      } else {
        response = new Response(JSON.stringify({
          error: 'Not found',
          message: 'Available endpoints: /api/links, /api/versions, /api/packages, /api/docs',
          docs: '/api/docs'
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        });
      }

      return response;
    } catch (error) {
      console.error('Error:', error);
      const errorResponse = new Response(JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
      return errorResponse;
    }
  }
};