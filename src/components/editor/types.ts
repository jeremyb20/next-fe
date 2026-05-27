import ReactQuill from 'react-quill-new';
import { Theme, SxProps } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface EditorProps extends React.ComponentProps<typeof ReactQuill> {
  error?: boolean;
  simple?: boolean;
  helperText?: React.ReactNode;
  sx?: SxProps<Theme>;
  id?: string;
}
