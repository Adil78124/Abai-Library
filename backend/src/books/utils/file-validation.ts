import { BadRequestException } from '@nestjs/common';

const PDF_MIME = 'application/pdf';
const IMAGE_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const PDF_MAX_BYTES = 100 * 1024 * 1024;
const IMAGE_MAX_BYTES = 10 * 1024 * 1024;

export function assertPdfUpload(file: Express.Multer.File | undefined): void {
  if (!file?.buffer?.length) {
    throw new BadRequestException('Файл PDF не передан');
  }
  if (file.size > PDF_MAX_BYTES) {
    throw new BadRequestException('PDF не должен превышать 100 МБ');
  }
  if (file.mimetype !== PDF_MIME) {
    throw new BadRequestException(
      'Недопустимый формат: требуется application/pdf',
    );
  }
}

export function assertImageUpload(file: Express.Multer.File | undefined): void {
  if (!file?.buffer?.length) {
    throw new BadRequestException('Файл изображения не передан');
  }
  if (file.size > IMAGE_MAX_BYTES) {
    throw new BadRequestException('Изображение не должно превышать 10 МБ');
  }
  if (!IMAGE_MIMES.has(file.mimetype)) {
    throw new BadRequestException(
      'Недопустимый формат: разрешены JPEG, PNG или WebP',
    );
  }
}
