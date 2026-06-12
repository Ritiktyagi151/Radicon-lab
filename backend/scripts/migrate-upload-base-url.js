const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DEFAULT_OLD_BASE_URL = 'http://localhost:5000';

loadEnvFile(path.join(__dirname, '..', '.env'));

const mongoUri = process.env.MONGODB_URI;
const oldBaseUrl = normalizeBaseUrl(
  process.env.OLD_BASE_URL || DEFAULT_OLD_BASE_URL,
);

if (!mongoUri) {
  fail('MONGODB_URI is required.');
}

async function main() {
  await mongoose.connect(mongoUri);

  const collections = await mongoose.connection.db.listCollections().toArray();
  let updatedRecords = 0;
  let scannedRecords = 0;

  for (const { name } of collections) {
    const collection = mongoose.connection.db.collection(name);
    const cursor = collection.find({});
    let collectionUpdatedRecords = 0;

    for await (const document of cursor) {
      scannedRecords += 1;

      const updatedDocument = stripUploadBaseUrl(document);
      if (!updatedDocument.changed) {
        continue;
      }

      const { _id, ...replacement } = updatedDocument.value;
      await collection.updateOne({ _id: document._id }, { $set: replacement });

      updatedRecords += 1;
      collectionUpdatedRecords += 1;
    }

    if (collectionUpdatedRecords > 0) {
      console.log(`${name}: updated ${collectionUpdatedRecords} record(s)`);
    }
  }

  console.log(
    `Migration complete. Scanned ${scannedRecords} record(s), updated ${updatedRecords} record(s).`,
  );

  await mongoose.disconnect();
}

function stripUploadBaseUrl(value) {
  if (typeof value === 'string') {
    const nextValue = stripUploadOrigin(value);
    if (nextValue === value) {
      return { value, changed: false };
    }

    return { value: nextValue, changed: true };
  }

  if (Array.isArray(value)) {
    let changed = false;
    const nextValue = value.map((item) => {
      const result = stripUploadBaseUrl(item);
      changed = changed || result.changed;
      return result.value;
    });

    return { value: nextValue, changed };
  }

  if (isPlainObject(value)) {
    let changed = false;
    const nextValue = {};

    for (const [key, item] of Object.entries(value)) {
      const result = stripUploadBaseUrl(item);
      changed = changed || result.changed;
      nextValue[key] = result.value;
    }

    return { value: nextValue, changed };
  }

  return { value, changed: false };
}

function stripUploadOrigin(value) {
  const exactOldBasePattern = escapeRegExp(oldBaseUrl);
  return value
    .replace(new RegExp(`${exactOldBasePattern}(?=/uploads/)`, 'g'), '')
    .replace(/https?:\/\/[^/"'\s<>]+(?=\/uploads\/)/g, '');
}

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Buffer.isBuffer(value) &&
    !(value instanceof Date) &&
    !(value instanceof mongoose.Types.ObjectId)
  );
}

function normalizeBaseUrl(value) {
  return value.trim().replace(/\/+$/, '');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) {
    return;
  }

  const envFile = fs.readFileSync(envPath, 'utf8');
  for (const line of envFile.split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match) {
      continue;
    }

    const key = match[1];
    let value = match[2] || '';

    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1).replace(/\\n/g, '\n');
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
