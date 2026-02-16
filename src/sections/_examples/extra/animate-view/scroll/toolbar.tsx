import Iconify from '@/components/iconify';

import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';

// ----------------------------------------------------------------------

type ToolbarProps = {
  onRefresh: VoidFunction;
};

export default function Toolbar({ onRefresh, ...other }: ToolbarProps) {
  return (
    <Paper
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
      {...other}
    >
      <IconButton onClick={onRefresh}>
        <Iconify icon="eva:refresh-fill" />
      </IconButton>
    </Paper>
  );
}
