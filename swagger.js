const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    tittle: 'Animal Api',
    description: 'Animal Api'
  },
  host: 'localhost:3000',
  schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
