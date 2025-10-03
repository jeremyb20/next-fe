import { Theme } from '@mui/material/styles';

export function container(theme: Theme) {
  return {
    MuiContainer: {
      styleOverrides: {
        root: {
          [theme.breakpoints.down('md')]: {
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
          },
        },
      },
    },
  };
}
