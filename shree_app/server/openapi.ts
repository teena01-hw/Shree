export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Authentication & Session API',
    description:
      'Production-ready authentication service utilizing PostgreSQL with encrypted Bcrypt password storage and JWT session tokens.',
    version: '1.0.0',
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url: '/',
      description: 'Current Environment Server',
    },
  ],
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Register a new customer account',
        description:
          'Validates customer details, hashes password with Bcrypt (12 salt rounds), stores in PostgreSQL, and generates a JWT session token.',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User successfully created',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthResponse',
                },
              },
            },
          },
          '400': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '409': {
            description: 'Username or Email already registered',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Authenticate and obtain JWT token',
        description:
          'Verifies username/email and password against stored Bcrypt hash in PostgreSQL and returns an access token.',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successfully authenticated',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthResponse',
                },
              },
            },
          },
          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/me': {
      get: {
        summary: 'Get current authenticated user profile',
        description:
          'Extracts and verifies JWT token from Authorization Bearer header, querying active user from PostgreSQL.',
        tags: ['Authentication'],
        security: [
          {
            BearerAuth: [],
          },
        ],
        responses: {
          '200': {
            description: 'Authenticated user profile',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserProfileResponse',
                },
              },
            },
          },
          '401': {
            description: 'Missing, expired, or invalid JWT token',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        summary: 'Logout current session',
        description: 'Confirms session invalidation.',
        tags: ['Authentication'],
        security: [
          {
            BearerAuth: [],
          },
        ],
        responses: {
          '200': {
            description: 'Successfully logged out',
          },
        },
      },
    },
    '/api/db/status': {
      get: {
        summary: 'PostgreSQL connection status',
        description:
          'Returns real-time health telemetry from the connected PostgreSQL database instance.',
        tags: ['System'],
        responses: {
          '200': {
            description: 'Database health telemetry',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/DbStatusResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/health': {
      get: {
        summary: 'Service health check',
        description: 'Simple health check for API server availability.',
        tags: ['System'],
        responses: {
          '200': {
            description: 'Service online',
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Provide JWT token obtained from `/api/auth/login` or `/api/auth/register`.',
      },
    },
    schemas: {
      RegisterRequest: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: {
            type: 'string',
            example: 'alex_smith',
            description: 'Alphanumeric, underscores, hyphens (3-50 chars)',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'alex@example.com',
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'SuperSecret123!',
            description: 'Minimum 8 characters with at least 1 letter and 1 number',
          },
          full_name: {
            type: 'string',
            example: 'Alex Smith',
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['identifier', 'password'],
        properties: {
          identifier: {
            type: 'string',
            example: 'alex_smith',
            description: 'Username or email address',
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'SuperSecret123!',
          },
        },
      },
      UserRecord: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          username: { type: 'string', example: 'alex_smith' },
          email: { type: 'string', example: 'alex@example.com' },
          full_name: { type: 'string', example: 'Alex Smith', nullable: true },
          is_active: { type: 'boolean', example: true },
          created_at: { type: 'string', format: 'date-time' },
          last_login: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Login successful!' },
          access_token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          token_type: { type: 'string', example: 'bearer' },
          user: { $ref: '#/components/schemas/UserRecord' },
        },
      },
      UserProfileResponse: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/UserRecord' },
          claims: {
            type: 'object',
            properties: {
              sub: { type: 'integer', example: 1 },
              username: { type: 'string', example: 'alex_smith' },
              email: { type: 'string', example: 'alex@example.com' },
              iat: { type: 'integer', example: 1712660000 },
              exp: { type: 'integer', example: 1712746400 },
            },
          },
        },
      },
      DbStatusResponse: {
        type: 'object',
        properties: {
          connected: { type: 'boolean', example: true },
          version: { type: 'string', example: 'PostgreSQL 18.6' },
          database: { type: 'string', example: 'OmniBill' },
          host: { type: 'string', example: 'pg.aivencloud.com' },
          port: { type: 'integer', example: 14315 },
          userCount: { type: 'integer', example: 3 },
          ssl: { type: 'boolean', example: true },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Unauthorized' },
          message: { type: 'string', example: 'Invalid credentials' },
          issues: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
};
