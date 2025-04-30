// api/main.js
export default async function handler(req, res) {
  const { input_token, gistId } = req.query;

  // Cek apakah parameter input_token dan gistId ada
  if (!input_token || !gistId) {
    return res.status(400).send('Both token and gistId are required');
  }

  const keyViewerApi = `https://time-api-indol.vercel.app/api/key-viewer.js?gistId=${gistId}`;
  const timeApi = 'https://time-api-indol.vercel.app/api/date.js';

  try {
    // Ambil string database dari API keyViewer
    const response = await fetch(keyViewerApi);
    const stringDatabase = await response.text();  // Mendapatkan teks mentah, bukan JSON

    // Cari baris yang sesuai dengan token yang dimasukkan
    const result = stringDatabase.split('\n').find(line => line.startsWith(input_token));
    if (!result) {
      return res.status(400).send('Wrong key');
    }

    // Pisahkan hasil menjadi beberapa nilai
    const [okey, oname, oexp, ostatus] = result.split(',');

    // Periksa apakah user adalah admin
    if (ostatus !== 'admin') {
      // Ambil tanggal saat ini dari API time
      const currentDateResponse = await fetch(timeApi);
      const { current_date } = await currentDateResponse.json();

      // Periksa apakah tanggal saat ini sudah melewati tanggal kedaluwarsa
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
