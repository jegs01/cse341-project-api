const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    tittle: 'Animal Api',
    description: 'Animal Api'
  },
  host: 'cse341-project-api.onrender.com',
  schemes: ['https', 'http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
