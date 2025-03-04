const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Currency-Converter API',
      version: '1.0.0',
      description: 'API for managing currency converer app.',
    },
    servers: [
    
      {
        url: 'https://currency-converter-api-sigma.vercel.app',
        description: 'Production server',
      },
        {
        url: 'http://localhost:8082',
        description: 'Local development server',
      },
    ],
  },
  apis: ['./routes/*.js'], 
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
module.exports = swaggerSpecs;
