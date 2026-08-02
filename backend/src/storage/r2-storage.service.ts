import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, CreateBucketCommand } from '@aws-sdk/client-s3';
import * as path from 'path';

@Injectable()
export class R2StorageService {
  private s3: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('R2_BUCKET_NAME', 'talentia-cvs');
    this.publicUrl = this.configService.get<string>('R2_PUBLIC_URL', 'http://localhost');
    
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${this.configService.get<string>('R2_ACCOUNT_ID', 'dev')}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.configService.get<string>('R2_ACCESS_KEY_ID', 'dev'),
        secretAccessKey: this.configService.get<string>('R2_SECRET_ACCESS_KEY', 'dev'),
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const extension = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3.send(command);
      return `${this.publicUrl}/${filename}`;
    } catch (error: any) {
      if (error.name === 'NoSuchBucket') {
        console.log(`El bucket '${this.bucketName}' no existe. Intentando crearlo automáticamente...`);
        try {
          await this.s3.send(new CreateBucketCommand({ Bucket: this.bucketName }));
          // Reintentar la subida después de crearlo
          await this.s3.send(command);
          return `${this.publicUrl}/${filename}`;
        } catch (createError) {
          console.error('No se pudo crear el bucket automáticamente:', createError);
          throw new InternalServerErrorException('Error al crear el bucket en R2');
        }
      }
      console.error('Error al subir archivo a R2:', error);
      throw new InternalServerErrorException('Error al subir archivo a R2');
    }
  }
}
