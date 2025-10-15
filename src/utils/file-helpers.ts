// utils/file-helpers.ts
import { UploadFile } from 'src/components/upload/types';

export const fileData = (file: UploadFile | string | File) => {
  if (typeof file === 'string') {
    return {
      key: file,
      name: file,
      size: 0,
      preview: file,
    };
  }

  if (file instanceof File) {
    return {
      key: file.name,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
    };
  }

  // Para objetos UploadFile
  const uploadFile = file as UploadFile;
  const preview =
    uploadFile.preview || uploadFile.imageURL || uploadFile.url || '';

  return {
    key:
      uploadFile._id ||
      uploadFile.id ||
      uploadFile.image_id ||
      uploadFile.name ||
      preview,
    name: uploadFile.name || 'Archivo',
    size: uploadFile.size || 0,
    preview,
  };
};

export const getImageUrl = (file: UploadFile | string | File): string => {
  if (typeof file === 'string') return file;
  if (file instanceof File) return URL.createObjectURL(file);

  const uploadFile = file as UploadFile;
  return uploadFile.preview || uploadFile.imageURL || uploadFile.url || '';
};
