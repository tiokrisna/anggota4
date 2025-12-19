const express = require('express');
const app = express();
const PORT = 3000;

const API_URL_MAHASISWA1 = "https://vendor-a.vercel.app/api/warung";
const API_URL_MAHASISWA2 = "https://vendor-b.vercel.app/api/products";
const API_URL_MAHASISWA3 = "https://vendor-c-phi.vercel.app/api/products";

async function getDataMahasiswa1() {
    const res = await fetch(API_URL_MAHASISWA1);
    const data = await res.json();
    const formattedData = data.map(item => ({
        id: item.kd_produk,
        nama: item.nm_brg,
        harga_final: parseInt(item.hrg, 10) * 0.9,
        //harga_final: item.hrg * 0.9,
        status: (item.ket_stok == "ada") ? "Tersedia" : "Tidak Tersedia",
        sumber: "Vendor A"
    }));

    return formattedData;
}

async function getDataMahasiswa2() {
    const res = await fetch(API_URL_MAHASISWA2);
    const data = await res.json();
    const formattedData = data.map(item => ({
        id: item.sku,
        nama: item.productName, 
        harga_final: item.price,
        status: item.isAvailable ? "Tersedia" : "Tidak Tersedia",
        sumber: "Vendor B"
    }));

    return formattedData;
}

async function getDataMahasiswa3() {
     const res = await fetch(API_URL_MAHASISWA3);
     const data = await res.json();
     const formattedData = data.map(item => ({
         id: item.id,
         nama: `${item.details.name}${item.details.category == "Food" ? " (Recommended)" : ""}`,
         harga_final: item.price,
         status: (item.stock <= 0) ? "TIdak Tersedia" : "Tersedia",
         sumber: "Vendor C",
     }));

    return formattedData;
}

app.get('/all', async (req, res) => {
    try {
        const [a, b, c] = await Promise.all([
            getDataMahasiswa1(),
            getDataMahasiswa2(),
            getDataMahasiswa3()
        ]);
        const merged = [...a, ...b, ...c];

        res.json({tioMukti:
             'project api',
              data: merged});

    } catch (error) {
        res.status(500).send('Terjadi kesalahan: ' + error.message);
    }
});


app.get('/vendor-a', async (req, res) => {
    try {
        const formattedData = await getDataMahasiswa1();
        res.json(formattedData);
    } catch (error) {
        res.status(500).send('Terjadi kesalahan: ' + error.message);
    }
});

app.get('/vendor-b', async (req, res) => {
    try {
        const formattedData = await getDataMahasiswa2();
        res.json(formattedData);
    } catch (error) {
        res.status(500).send('Terjadi kesalahan: ' + error.message);
    }
});

app.get('/vendor-c', async (req, res) => {
    try {
        const formattedData = await getDataMahasiswa3();
        res.json(formattedData);
    } catch (error) {
        res.status(500).send('Terjadi kesalahan: ' + error.message);
    }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});