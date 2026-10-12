import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EncryptionTransformer } from 'typeorm-encrypted';
import { encryptionOptions } from './encryption.config';

@Entity({ name: 'encrypted_demo' })
export class EncryptedData {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'sensitive_value',
    type: 'text',
    transformer: new EncryptionTransformer(encryptionOptions),
  })
  sensitiveValue!: string;
}
