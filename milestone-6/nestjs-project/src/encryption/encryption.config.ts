import 'dotenv/config';

const key = process.env.ENCRYPTION_KEY;

if (!key || !/^[0-9a-fA-F]{64}$/.test(key)) {
  throw new Error(
    'ENCRYPTION_KEY must be a 64-character hexadecimal key in the local environment.',
  );
}

export const encryptionOptions = {
  key,
  algorithm: 'aes-256-gcm',
  ivLength: 16,
};
