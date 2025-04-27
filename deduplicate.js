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
    writeStream.write(headers.join(',') + '\n');

    uniqueProducts.forEach((product) => {
      const row = headers.map((header) => product[header]).join(',');
      writeStream.write(row + '\n');
    });

    let duplicatesFile = '';
    if (duplicates.length > 0) {
      duplicatesFile = 'duplicates_backup.csv';
      const dupStream = fs.createWriteStream(duplicatesFile);
      dupStream.write(headers.join(',') + '\n');
      duplicates.forEach((product) => {
        const row = headers.map((header) => product[header]).join(',');
        dupStream.write(row + '\n');
      });
    }

    console.log(`✅ Deduplication complete. Processed: ${products.length}, Kept: ${uniqueProducts.length}, Duplicates: ${duplicates.length}${duplicatesFile ? `, Backup: '${duplicatesFile}'` : ''}`);
  });