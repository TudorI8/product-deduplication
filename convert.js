const parquet = require('parquetjs-lite');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

async function convert() {
  const parquetFile = path.resolve(__dirname, 'veridion_product_deduplication_challenge.snappy.parquet');
  const csvFile     = path.resolve(__dirname, 'products.csv');

  const reader = await parquet.ParquetReader.openFile(parquetFile);
  const cursor = reader.getCursor();
  const rows = [];
  let record = null;

  while (record = await cursor.next()) {
    rows.push(record);
  }
  await reader.close();

  if (!rows.length) {
    console.log('⚠️  Parquet file is empty.');
    return;
  }

  const headers = Object.keys(rows[0]).map(col => ({ id: col, title: col }));
  const csvWriter = createCsvWriter({ path: csvFile, header: headers });

  await csvWriter.writeRecords(rows);
  console.log('✅ Complete conversion: products.csv generated.');
}

convert().catch(err => console.error('❌ Conversion error:', err));