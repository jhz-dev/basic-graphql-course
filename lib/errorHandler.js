'use strict'

function errorHandler(error) {
    console.error(error);
    throw new Error('Fallo en la operaci{on del servidor');
}

module.exports = errorHandler