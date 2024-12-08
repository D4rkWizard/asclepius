const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const { Firestore } = require('@google-cloud/firestore');

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    const { label, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
   
    const data = {
      "id": id,
      "result": label,
      "suggestion": suggestion,
      "createdAt": createdAt
    }

    await storeData(id, data);

    const response = h.response({
        status: 'success',
        message: 'Model is predicted successfully',
        data
      })
      response.code(201);
      return response;
}

async function getHistoriesHandler(request, h) {
  const db = new Firestore();
  const predictCollection = db.collection('prediction');

  try {
      const snapshot = await predictCollection.get();
      
      if (snapshot.empty) {
          throw new InputError('Tidak ada riwayat prediksi ditemukan');
      }

      const histories = snapshot.docs.map(doc => doc.data());
      
      return h.response({
          status: 'success',
          message: 'Riwayat prediksi berhasil diambil',
          data: histories
      }).code(200);

  } catch (error) {
      if (error instanceof InputError) {
          return h.response({
              status: 'fail',
              message: error.message
          }).code(error.statusCode);
      }

      // Menangani kesalahan yang tidak terduga
      return h.response({
          status: 'fail',
          message: 'Terjadi kesalahan saat mengambil riwayat prediksi'
      }).code(500);
  }
}

module.exports = {
  postPredictHandler,
  getHistoriesHandler,
}