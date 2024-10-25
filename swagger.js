const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    tittle: 'Animal Api',
    description: 'Animal Api'
  },
  host: 'localhost:3000',
  schemes: ['https', 'http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
