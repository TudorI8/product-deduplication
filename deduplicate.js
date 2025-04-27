const fs = require('fs');
const csv = require('csv-parser');

function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function cleanCell(value) {
  const stringValue = String(value || '');
  return `"${stringValue
    .replace(/(\r\n|\n|\r)/g, ' ')
    .replace(/"/g, '""')
    .trim()}"`;
}

const products = [];
fs.createReadStream('products.csv')
  .pipe(csv())
  .on('data', (row) => products.push(row))
  .on('end', () => {
    const uniqueProducts = [];
    const duplicates = [];
    const seenIdentifiers = new Set();

    products.forEach((product) => {
      const normalizedId = normalize(product.product_identifier);

      if (!seenIdentifiers.has(normalizedId)) {
        seenIdentifiers.add(normalizedId);
        uniqueProducts.push(product);
      } else {
        duplicates.push(product);
      }
    });

    const outputFile = 'deduplicated_products.csv';
    const headers = Object.keys(uniqueProducts[0]);
    const writeStream = fs.createWriteStream(outputFile);
    writeStream.write(headers.map((header) => cleanCell(header)).join(',') + '\n');

    uniqueProducts.forEach((product) => {
      const row = headers.map((header) => cleanCell(product[header])).join(',');
      writeStream.write(row + '\n');
    });

    writeStream.end();

    let duplicatesFile = '';
    if (duplicates.length > 0) {
      duplicatesFile = 'duplicates_backup.csv';
      const dupStream = fs.createWriteStream(duplicatesFile);
      dupStream.write(headers.map((header) => cleanCell(header)).join(',') + '\n');
      duplicates.forEach((product) => {
        const row = headers.map((header) => cleanCell(product[header])).join(',');
        dupStream.write(row + '\n');
      });
      dupStream.end();
    }

    console.log(`✅ Deduplication complete. Processed: ${products.length}, Kept: ${uniqueProducts.length}, Duplicates: ${duplicates.length}${duplicatesFile ? `, Backup: '${duplicatesFile}'` : ''}`);
  });