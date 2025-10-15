// types.ts
import { DropzoneOptions } from 'react-dropzone';

import { Theme, SxProps } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface CustomFile extends File {
  path?: string;
  preview?: string;
  lastModifiedDate?: Date;
}

// Extiende CustomFile para incluir propiedades de imágenes existentes
export interface UploadFile extends CustomFile {
  _id?: string;
  id?: string;
  imageURL?: string;
  url?: string;
  image_id?: string;
}

export interface UploadProps extends DropzoneOptions {
  error?: boolean;
  sx?: SxProps<Theme>;
  thumbnail?: boolean;
  placeholder?: React.ReactNode;
  helperText?: React.ReactNode;
  disableMultiple?: boolean;
  //
  file?: UploadFile | string | null;
  onDelete?: VoidFunction;
  //
  files?: (UploadFile | string)[];
  onUpload?: VoidFunction;
  onRemove?: (file: UploadFile | string) => void;
  //  onRemove?: (index: number) => void;
  onRemoveAll?: VoidFunction;
}
