import 'dotenv/config';
import { DataSource } from 'typeorm';
import { EncryptedData } from './encryption/encrypted-data.entity';

async function runEncryptionTest() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5434),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE ?? 'nestjs_demo',
    entities: [EncryptedData],
    synchronize: true,
  });

  await dataSource.initialize();

  try {
    const repository = dataSource.getRepository(EncryptedData);
    const originalValue = 'demo-sensitive-value-for-encryption-test';

    const saved = await repository.save(
      repository.create({ sensitiveValue: originalValue }),
    );

    try {
      const rawRows = await dataSource.query(
        'SELECT sensitive_value FROM encrypted_demo WHERE id = $1',
        [saved.id],
      );

      const ciphertext = rawRows[0]?.sensitive_value;

      if (
        typeof ciphertext !== 'string' ||
        ciphertext === originalValue
      ) {
        throw new Error('Database value was not stored as ciphertext.');
      }

      console.log('Database encryption verified: PASS');
      console.log(`Stored value is ciphertext: ${ciphertext !== originalValue}`);

      const fetched = await repository.findOneByOrFail({ id: saved.id });

      if (fetched.sensitiveValue !== originalValue) {
        throw new Error('Decrypted value does not match the original value.');
      }

      console.log('TypeORM decryption verified: PASS');
      console.log('Original value recovered successfully: PASS');
    } finally {
      await repository.delete(saved.id);
      console.log('Test record removed: PASS');
    }
  } finally {
    await dataSource.destroy();
  }
}

runEncryptionTest().catch((error) => {
  console.error('Encryption test failed:', error.message);
  process.exitCode = 1;
});
