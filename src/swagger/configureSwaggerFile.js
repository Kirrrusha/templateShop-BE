const path = require('path');
const fs = require('fs');
const swaggerFile = require('./swagger.json');

function findFilesByPattern(base, pattern, result = []) {
  const files = fs.readdirSync(base);

  files.forEach(file => {
    const filePath = path.join(base, file);

    if (fs.statSync(filePath).isDirectory()) {
      findFilesByPattern(filePath, pattern, result);
    } else {
      if (pattern.test(file)) result.push(filePath);
    }
  });

  return result;
}

const configureSwaggerFile = () => {
  const pattern = /[A-Za-z\-]+schema.json$/
  const files = findFilesByPattern(path.join(__dirname, '..'), pattern);

  files.forEach(file => {
    const schemaFile = require(file);

    if (schemaFile.hasOwnProperty('definitions')) {
      Object.assign(swaggerFile.definitions, schemaFile.definitions);
    }

    if(schemaFile.hasOwnProperty('paths')) {
      Object.assign(swaggerFile.paths, schemaFile.paths);
    }
  });

  return swaggerFile;
}

const swaggerConfig = configureSwaggerFile();

module.exports = swaggerConfig;
