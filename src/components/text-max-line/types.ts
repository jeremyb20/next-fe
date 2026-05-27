import { LinkProps } from '@mui/material/Link';
import { TypographyProps } from '@mui/material/Typography';

// ----------------------------------------------------------------------

type IProps = TypographyProps & LinkProps;
type Variant = TypographyProps['variant'];
export interface TextMaxLineProps extends IProps {
  line?: number;
  asLink?: boolean;
  persistent?: boolean;
  children: React.ReactNode;
  variant?: Variant;
}
