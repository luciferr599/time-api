// api/validator.js

export default async function handler(req, res) {
  const { input_token, gistId } = req.query;

  // Validasi parameter input_token dan gistId
  if (!input_token || !gistId) {
    return res.status(400).send('Both token and gistId are required');
  }

  const keyViewerApi = `https://time-api-indol.vercel.app/api/key-viewer.js?gistId=${gistId}`;
  const timeApi = 'https://time-api-indol.vercel.app/api/date.js';

  try {
    // Mengambil string database dari keyViewerApi sebagai raw text (CSV)
    const response = await fetch(keyViewerApi);
    const stringDatabase = await response.text(); // Mendapatkan data dalam format raw text (CSV)

    // Mencari baris yang sesuai dengan input_token
    const result = stringDatabase.split('\n').find(line => line.startsWith(input_token));
    if (!result) {
      return res.status(400).send('Wrong key');
    }

    // Memecah hasil berdasarkan koma untuk mendapatkan okey, oname, oexp, ostatus
    const [okey, oname, oexp, ostatus] = result.split(',');

    // Memeriksa apakah statusnya "admin"
    if (ostatus !== 'admin') {
      // Ambil tanggal saat ini dari API time
      const currentDateResponse = await fetch(timeApi);
      const { current_date } = await currentDateResponse.json();

      // Cek apakah tanggal kedaluwarsa sudah lewat
      if (current_date > oexp) {
        return res.status(400).send('Key expired');
      } else {
        return res.status(200).send('Valid');
      }
    } else {
      return res.status(200).send('You are logged in as admin');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
}
