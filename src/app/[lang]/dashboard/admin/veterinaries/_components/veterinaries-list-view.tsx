'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import FormControlLabel from '@mui/material/FormControlLabel';
import { CircularProgress, Container, InputAdornment } from '@mui/material';

import { paths } from '@/routes/paths';
import Label from '@/components/label';
import { IVeterinary } from '@/types/api';
import Iconify from '@/components/iconify';
import { fDate } from '@/utils/format-time';
import { useBoolean } from '@/hooks/use-boolean';
import { useSnackbar } from '@/components/snackbar';
import { ConfirmDialog } from '@/components/custom-dialog';
import { useSettingsContext } from '@/components/settings';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
import {
  IVeterinaryPayload,
  useAdminVeterinaries,
  useCreateVeterinary,
  useDeleteVeterinary,
  useUpdateVeterinary,
} from '@/hooks/use-veterinary';

type FormState = IVeterinaryPayload & { isActive: boolean };

const emptyForm: FormState = {
  name: '',
  legalName: '',
  licenseNumber: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  country: '',
  website: '',
  ownerEmail: '',
  ownerPassword: '',
  ownerName: '',
  ownerPhone: '',
  isActive: true,
};

export default function VeterinariesListView() {
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useBoolean();
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<IVeterinary | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const settings = useSettingsContext();

  const { data, isLoading, isFetching } = useAdminVeterinaries({
    page: 1,
    limit: 50,
    search: appliedSearch || undefined,
  });

  const createMutation = useCreateVeterinary();
  const updateMutation = useUpdateVeterinary();
  const deleteMutation = useDeleteVeterinary();

  const veterinaries = useMemo(() => data?.data ?? [], [data?.data]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (veterinary: IVeterinary) => {
    setEditing(veterinary);
    setForm({
      name: veterinary.name,
      legalName: veterinary.legalName ?? '',
      licenseNumber: veterinary.licenseNumber ?? '',
      email: veterinary.email,
      phone: veterinary.phone,
      address: veterinary.address ?? '',
      city: veterinary.city ?? '',
      state: veterinary.state ?? '',
      country: veterinary.country ?? '',
      website: veterinary.website ?? '',
      ownerEmail: '',
      ownerPassword: '',
      ownerName: '',
      ownerPhone: '',
      isActive: veterinary.isActive,
    });
    setDialogOpen(true);
  };

  const setField = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!form.name || !form.email || !form.phone) {
        enqueueSnackbar('Name, email and phone are required', {
          variant: 'warning',
        });
        return;
      }

      if (!editing && (!form.ownerEmail || !form.ownerPassword)) {
        enqueueSnackbar(
          'Owner email and password are required to create the veterinarian account',
          { variant: 'warning' }
        );
        return;
      }

      const payload: IVeterinaryPayload = {
        name: form.name,
        legalName: form.legalName,
        licenseNumber: form.licenseNumber,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        country: form.country,
        website: form.website,
        isActive: form.isActive,
        ...(form.ownerEmail && { ownerEmail: form.ownerEmail }),
        ...(form.ownerPassword && { ownerPassword: form.ownerPassword }),
        ...(form.ownerName && { ownerName: form.ownerName }),
        ...(form.ownerPhone && { ownerPhone: form.ownerPhone }),
      };

      if (editing) {
        await updateMutation.mutateAsync({ id: editing._id, payload });
        enqueueSnackbar('Veterinary clinic updated');
      } else {
        await createMutation.mutateAsync(payload);
        enqueueSnackbar('Veterinary clinic created');
      }

      setDialogOpen(false);
    } catch (error: any) {
      enqueueSnackbar(error?.message || 'Could not save veterinary clinic', {
        variant: 'error',
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteMutation.mutateAsync(deletingId);
      enqueueSnackbar('Veterinary clinic deactivated');
    } catch (error: any) {
      enqueueSnackbar(error?.message || 'Could not deactivate clinic', {
        variant: 'error',
      });
    } finally {
      setDeletingId(null);
      confirm.onFalse();
    }
  };

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Veterinary Clinics"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Veterinary Clinics' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={openCreate}
            >
              New clinic
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card sx={{ p: 2 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <TextField
              size="small"
              placeholder="Search by name, email or phone"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') setAppliedSearch(search.trim());
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: { sm: 360 } }}
            />
            <Button
              variant="outlined"
              onClick={() => setAppliedSearch(search.trim())}
            >
              Search
            </Button>
          </Stack>

          <TableContainer>
            <Table sx={{ minWidth: 760 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Clinic</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {veterinaries.map((veterinary) => (
                  <TableRow key={veterinary._id} hover>
                    <TableCell>
                      <Typography variant="body2">{veterinary.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {veterinary.legalName ||
                          veterinary.licenseNumber ||
                          '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>{veterinary.email}</TableCell>
                    <TableCell>{veterinary.phone}</TableCell>
                    <TableCell>{fDate(veterinary.createdAt)}</TableCell>
                    <TableCell>
                      <Label
                        variant="soft"
                        color={veterinary.isActive ? 'success' : 'error'}
                      >
                        {veterinary.isActive ? 'active' : 'inactive'}
                      </Label>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => openEdit(veterinary)}>
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setDeletingId(veterinary._id);
                          confirm.onTrue();
                        }}
                      >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

                {!veterinaries.length && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      {isLoading || isFetching ? (
                        <CircularProgress size={24} />
                      ) : (
                        <Typography color="text.secondary">
                          No veterinary clinics found
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Container>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editing ? 'Edit veterinary clinic' : 'New veterinary clinic'}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              pt: 1,
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            }}
          >
            <TextField
              label="Name"
              value={form.name}
              onChange={(event) => setField('name', event.target.value)}
              required
            />
            <TextField
              label="Legal name"
              value={form.legalName}
              onChange={(event) => setField('legalName', event.target.value)}
            />
            <TextField
              label="License number"
              value={form.licenseNumber}
              onChange={(event) =>
                setField('licenseNumber', event.target.value)
              }
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => setField('email', event.target.value)}
              required
            />
            <TextField
              label="Phone"
              value={form.phone}
              onChange={(event) => setField('phone', event.target.value)}
              required
            />
            <TextField
              label="Website"
              value={form.website}
              onChange={(event) => setField('website', event.target.value)}
            />
            <TextField
              label="Address"
              value={form.address}
              onChange={(event) => setField('address', event.target.value)}
            />
            <TextField
              label="City"
              value={form.city}
              onChange={(event) => setField('city', event.target.value)}
            />
            <TextField
              label="State"
              value={form.state}
              onChange={(event) => setField('state', event.target.value)}
            />
            <TextField
              label="Country"
              value={form.country}
              onChange={(event) => setField('country', event.target.value)}
            />
            {!editing && (
              <>
                <TextField
                  label="Owner email"
                  type="email"
                  value={form.ownerEmail}
                  onChange={(event) =>
                    setField('ownerEmail', event.target.value)
                  }
                  helperText="Credentials for the veterinarian owner"
                  required
                />
                <TextField
                  label="Owner password"
                  type="password"
                  value={form.ownerPassword}
                  onChange={(event) =>
                    setField('ownerPassword', event.target.value)
                  }
                  helperText="Min. 6 chars, uppercase, lowercase and number"
                  required
                />
                <TextField
                  label="Owner name"
                  value={form.ownerName}
                  onChange={(event) =>
                    setField('ownerName', event.target.value)
                  }
                />
                <TextField
                  label="Owner phone"
                  value={form.ownerPhone}
                  onChange={(event) =>
                    setField('ownerPhone', event.target.value)
                  }
                />
              </>
            )}
            {editing && (
              <FormControlLabel
                control={
                  <Switch
                    checked={form.isActive}
                    onChange={(event) =>
                      setField('isActive', event.target.checked)
                    }
                  />
                }
                label="Active"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Deactivate clinic"
        content="The clinic will stop being available for its members. Continue?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            Deactivate
          </Button>
        }
      />
    </>
  );
}
