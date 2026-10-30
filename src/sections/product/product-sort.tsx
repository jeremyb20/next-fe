import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import Iconify from '@/components/iconify';
import { useTranslation } from '@/hooks/use-translation';
import CustomPopover, { usePopover } from '@/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  sort: string;
  onSort: (newValue: string) => void;
  sortOptions: {
    value: string;
    label: string;
  }[];
};

export default function ProductSort({ sort, onSort, sortOptions }: Props) {
  const popover = usePopover();
  const { t } = useTranslation();

  const sortLabel = sortOptions.find((option) => option.value === sort)?.label;

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={popover.onOpen}
        endIcon={
          <Iconify
            icon={
              popover.open
                ? 'eva:arrow-ios-upward-fill'
                : 'eva:arrow-ios-downward-fill'
            }
          />
        }
        sx={{ fontWeight: 'fontWeightSemiBold' }}
      >
        {t('Sort By')}:
        <Box component="span" sx={{ ml: 0.5, fontWeight: 'fontWeightBold' }}>
          {sortLabel}
        </Box>
      </Button>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{ width: 140 }}
      >
        {sortOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === sort}
            onClick={() => {
              popover.onClose();
              onSort(option.value);
            }}
          >
            {t(option.label)}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
