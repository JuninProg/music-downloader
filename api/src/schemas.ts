import { FastifySchema } from 'fastify';

export const postMusicsSchema: FastifySchema = {
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['dirs'],
    properties: {
      dirs: {
        type: 'array',
        minItems: 1,
        uniqueItems: true,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['name', 'links'],
          properties: {
            name: {
              type: 'string',
              minLength: 1,
            },
            links: {
              type: 'array',
              minItems: 1,
              uniqueItems: true,
              items: {
                type: 'string',
                minLength: 1,
              },
            },
          },
        },
      },
    },
  },
};

export const getMusicsSchema: FastifySchema = {
  params: {
    type: 'object',
    additionalProperties: false,
    required: ['name'],
    properties: {
      name: {
        type: 'string',
        minLength: 1,
      },
    },
  },
};
