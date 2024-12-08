const Handler = require('../server/handler');
 
const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: Handler.postPredictHandler,
    options: {
      payload: {
        /*Mengizinkan data berupa gambar*/
        allow: 'multipart/form-data',
        multipart: true
      }
    }
  },
  {
    path: '/predict/histories',
    method: 'GET',
    handler: Handler.getHistoriesHandler, // Handler untuk mengambil riwayat prediksi
  }
]
 
module.exports = routes;