export default function handler(req, res) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Mengembalikan tanggal dalam format teks biasa
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(formattedDate);
}
