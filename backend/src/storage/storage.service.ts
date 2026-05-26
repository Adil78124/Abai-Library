import {
  DeleteObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as path from 'path';

export type StorageObjectKind = 'pdf' | 'images';

@Injectable()
export class StorageService implements OnModuleInit {
  private client!: S3Client;
  private bucket!: string;
  private publicBaseUrl!: string;

  onModuleInit() {
    const endpoint = process.env.MINIO_ENDPOINT?.trim();
    const port = process.env.MINIO_PORT?.trim() ?? '9000';
    const useSsl = process.env.MINIO_USE_SSL === 'true';
    const accessKey = process.env.MINIO_ACCESS_KEY?.trim();
    const secretKey = process.env.MINIO_SECRET_KEY?.trim();
    this.bucket = process.env.MINIO_BUCKET?.trim() ?? '';

    if (!endpoint || !accessKey || !secretKey || !this.bucket) {
      throw new Error(
        'MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY and MINIO_BUCKET are required',
      );
    }

    const protocol = useSsl ? 'https' : 'http';
    const s3Endpoint = `${protocol}://${endpoint}:${port}`;

    this.publicBaseUrl =
      process.env.MINIO_PUBLIC_URL?.trim()?.replace(/\/$/, '') ??
      s3Endpoint;

    this.client = new S3Client({
      endpoint: s3Endpoint,
      region: process.env.MINIO_REGION?.trim() ?? 'us-east-1',
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
      forcePathStyle: true,
    });
  }

  generateObjectKey(
    bookId: string,
    kind: StorageObjectKind,
    originalName: string,
  ): string {
    const ext = path.extname(originalName).toLowerCase() || '';
    const safeBase =
      path
        .basename(originalName, ext)
        .replace(/[^a-zA-Z0-9._-]+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 80) || 'file';
    const suffix = ext || (kind === 'pdf' ? '.pdf' : '.bin');
    return `books/${bookId}/${kind}/${safeBase}-${randomUUID().slice(0, 8)}${suffix}`;
  }

  async uploadFile(
    key: string,
    body: Buffer,
    contentType: string,
  ): Promise<string> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
    return key;
  }

  async deleteFile(keyOrUrl: string): Promise<void> {
    const key = this.extractObjectKey(keyOrUrl);
    if (!key) return;

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  getPublicUrl(key: string): string {
    const objectKey = this.extractObjectKey(key) ?? key;
    return `${this.publicBaseUrl}/${this.bucket}/${objectKey}`;
  }

  /** Ключ объекта в MinIO (books/...) или null для legacy значений. */
  extractObjectKey(value: string | null | undefined): string | null {
    if (!value?.trim()) return null;
    const trimmed = value.trim();
    if (trimmed.startsWith('books/')) return trimmed;

    const bucketPrefix = `/${this.bucket}/`;
    const idx = trimmed.indexOf(bucketPrefix);
    if (idx >= 0) {
      return trimmed.slice(idx + bucketPrefix.length);
    }

    return null;
  }

  isManagedStorageKey(value: string | null | undefined): boolean {
    return Boolean(this.extractObjectKey(value));
  }

  async checkBucket(): Promise<boolean> {
    await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
    return true;
  }
}
