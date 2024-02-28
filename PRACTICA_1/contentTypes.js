//content-types
const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.png': 'image/png',
};

function getContentType(extension) {
    if (contentTypes[extension]) {
        // Si es uno esperado, devolvemos el resultado
        return contentTypes[extension];
      } else {
        // sino, lo indicamos
        console.log("Módulo contentType.js - Extensión no esparada: "+extension)
        return;
      }
}
  
module.exports = {
    getContentType: getContentType,
};