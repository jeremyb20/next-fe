'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CardActionArea from '@mui/material/CardActionArea';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from '@/routes/paths';
import Label from '@/components/label';
import Iconify from '@/components/iconify';
import { RouterLink } from '@/routes/components';
import { useSnackbar } from '@/components/snackbar';
import EmptyContent from '@/components/empty-content';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
import {
  IUser,
  IVeterinary,
  IVeterinaryMember,
  VeterinaryMemberRole,
} from '@/types/api';
import {
  useAddVeterinaryMember,
  useCreateVeterinaryOwner,
  useMyVeterinaries,
  useVeterinaryMembers,
  useVeterinaryPets,
} from '@/hooks/use-veterinary';

const getVeterinary = (
  membership: IVeterinaryMember
): IVeterinary | null =>
  typeof membership.veterinaryId === 'string'
    ? null
    : membership.veterinaryId;

const getMemberUser = (membership: IVeterinaryMember): IUser | null =>
  typeof membership.userId === 'string' ? null : membership.userId;

const emptyMemberForm: {
  name: string;
  email: string;
  phone: string;
  password: string;
  memberRole: VeterinaryMemberRole;
} = {
  name: '',
  email: '',
  phone: '',
  password: '',
  memberRole: 'veterinarian',
};

const emptyOwnerForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
};

export default function VeterinaryDashboardView() {
  const { enqueueSnackbar } = useSnackbar();
  const { data: membershipsData, isLoading: isLoadingMemberships } =
    useMyVeterinaries();
  const [selectedId, setSelectedId] = useState('');
  const [memberOpen, setMemberOpen] = useState(false);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [memberForm, setMemberForm] = useState(emptyMemberForm);
  const [ownerForm, setOwnerForm] = useState(emptyOwnerForm);

  const memberships = membershipsData?.data ?? [];

  const clinics = useMemo(
    () =>
      memberships
        .map((membership) => ({
          membership,
          veterinary: getVeterinary(membership),
        }))
        .filter(
          (item): item is { membership: IVeterinaryMember; veterinary: IVeterinary } =>
            Boolean(item.veterinary)
        ),
    [memberships]
  );

  const activeId = selectedId || clinics[0]?.veterinary._id || '';

  const { data: petsData, isLoading: isLoadingPets } = useVeterinaryPets(
    activeId,
    Boolean(activeId)
  );

  const pets = petsData?.data ?? [];

  const { data: membersData, isLoading: isLoadingMembers } =
    useVeterinaryMembers(activeId, Boolean(activeId));
  const addMemberMutation = useAddVeterinaryMember();
  const createOwnerMutation = useCreateVeterinaryOwner();

  const members = membersData?.data ?? [];
  const activeMembership = clinics.find(
    (item) => item.veterinary._id === activeId
  )?.membership;
  const isOwner = activeMembership?.memberRole === 'owner';

  const openMemberDialog = () => {
    setMemberForm(emptyMemberForm);
    setMemberOpen(true);
  };

  const openOwnerDialog = () => {
    setOwnerForm(emptyOwnerForm);
    setOwnerOpen(true);
  };

  const handleAddMember = async () => {
    if (!memberForm.email) {
      enqueueSnackbar('Email is required', { variant: 'warning' });
      return;
    }

    try {
      const result = await addMemberMutation.mutateAsync({
        veterinaryId: activeId,
        payload: memberForm,
      });

      enqueueSnackbar(
        result?.createdUser
          ? 'Collaborator account created and added to the clinic'
          : 'Collaborator added to the clinic'
      );
      setMemberOpen(false);
    } catch (error) {
      enqueueSnackbar(
        error instanceof Error ? error.message : 'Could not add collaborator',
        { variant: 'error' }
      );
    }
  };

  const handleCreateOwner = async () => {
    if (!ownerForm.email || !ownerForm.password) {
      enqueueSnackbar('Email and password are required', {
        variant: 'warning',
      });
      return;
    }

    try {
      const result = await createOwnerMutation.mutateAsync({
        veterinaryId: activeId,
        payload: ownerForm,
      });

      enqueueSnackbar(
        `Pet owner account created: ${result?.data?.email ?? ownerForm.email}`
      );
      setOwnerOpen(false);
    } catch (error) {
      enqueueSnackbar(
        error instanceof Error ? error.message : 'Could not create pet owner',
        { variant: 'error' }
      );
    }
  };

  if (isLoadingMemberships) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!clinics.length) {
    return (
      <EmptyContent
        filled
        title="No veterinary clinic assigned"
        description="Ask an administrator to add you as a member of a veterinary clinic."
        sx={{ py: 10 }}
      />
    );
  }

  return (
    <>
      <CustomBreadcrumbs
        heading="Veterinary Clinic"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Veterinary Clinic' },
        ]}
        action={
          isOwner ? (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="mingcute:user-add-line" />}
                onClick={openMemberDialog}
              >
                New collaborator
              </Button>
              <Button
                variant="contained"
                startIcon={<Iconify icon="mingcute:user-add-line" />}
                onClick={openOwnerDialog}
              >
                New pet owner
              </Button>
            </Stack>
          ) : undefined
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            {clinics.map(({ membership, veterinary }) => (
              <Card
                key={membership._id}
                sx={{
                  border: (theme) =>
                    veterinary._id === activeId
                      ? `2px solid ${theme.palette.primary.main}`
                      : '2px solid transparent',
                }}
              >
                <CardActionArea
                  onClick={() => setSelectedId(veterinary._id)}
                  sx={{ p: 2 }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={1}
                  >
                    <Box>
                      <Typography variant="subtitle1">
                        {veterinary.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {veterinary.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {veterinary.phone}
                      </Typography>
                    </Box>
                    <Label variant="soft" color="primary">
                      {membership.memberRole}
                    </Label>
                  </Stack>
                </CardActionArea>
              </Card>
            ))}

            <Card>
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h6">Team</Typography>
                  <Label variant="soft">{members.length}</Label>
                </Stack>

                {isLoadingMembers ? (
                  <CircularProgress size={24} />
                ) : (
                  members.map((member) => {
                    const user = getMemberUser(member);

                    return (
                      <Stack
                        key={member._id}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1}
                        sx={{ py: 1 }}
                      >
                        <Box>
                          <Typography variant="body2">
                            {user?.profile?.name || user?.email || 'Member'}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {user?.email || '-'}
                          </Typography>
                        </Box>
                        <Label
                          variant="soft"
                          color={
                            member.memberRole === 'owner'
                              ? 'primary'
                              : 'default'
                          }
                        >
                          {member.memberRole}
                        </Label>
                      </Stack>
                    );
                  })
                )}

                {!members.length && !isLoadingMembers && (
                  <Typography color="text.secondary" variant="body2">
                    No collaborators yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2 }}
              >
                <Typography variant="h6">Patients</Typography>
                <Label variant="soft">{pets.length}</Label>
              </Stack>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Pet</TableCell>
                      <TableCell>ID</TableCell>
                      <TableCell>Owner</TableCell>
                      <TableCell align="right">Clinical record</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pets.map((pet) => (
                      <TableRow key={pet._id} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {pet.petName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {pet.breed || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>{pet.memberPetId}</TableCell>
                        <TableCell>
                          {pet.ownerPetName || pet.owner?.name || '-'}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            component={RouterLink}
                            href={paths.dashboard.veterinary.patient(
                              activeId,
                              pet.memberPetId
                            )}
                            endIcon={
                              <Iconify icon="eva:arrow-ios-forward-fill" />
                            }
                          >
                            Open
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}

                    {!pets.length && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                          {isLoadingPets ? (
                            <CircularProgress size={24} />
                          ) : (
                            <Typography color="text.secondary">
                              This clinic has no patients yet
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={memberOpen}
        onClose={() => setMemberOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>New collaborator</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Name"
              value={memberForm.name}
              onChange={(event) =>
                setMemberForm((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={memberForm.email}
              onChange={(event) =>
                setMemberForm((prev) => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
              helperText="If the user exists, they are added to the clinic"
              required
              fullWidth
            />
            <TextField
              label="Phone"
              value={memberForm.phone}
              onChange={(event) =>
                setMemberForm((prev) => ({
                  ...prev,
                  phone: event.target.value,
                }))
              }
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={memberForm.password}
              onChange={(event) =>
                setMemberForm((prev) => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
              helperText="Required only if the user does not exist yet"
              fullWidth
            />
            <TextField
              select
              label="Role"
              value={memberForm.memberRole}
              onChange={(event) =>
                setMemberForm((prev) => ({
                  ...prev,
                  memberRole: event.target.value as VeterinaryMemberRole,
                }))
              }
              fullWidth
            >
              <MenuItem value="veterinarian">Veterinarian</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMemberOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddMember}
            disabled={addMemberMutation.isPending}
          >
            {addMemberMutation.isPending ? 'Saving...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={ownerOpen}
        onClose={() => setOwnerOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>New pet owner</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Name"
              value={ownerForm.name}
              onChange={(event) =>
                setOwnerForm((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={ownerForm.email}
              onChange={(event) =>
                setOwnerForm((prev) => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
              required
              fullWidth
            />
            <TextField
              label="Phone"
              value={ownerForm.phone}
              onChange={(event) =>
                setOwnerForm((prev) => ({
                  ...prev,
                  phone: event.target.value,
                }))
              }
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={ownerForm.password}
              onChange={(event) =>
                setOwnerForm((prev) => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
              helperText="Min. 6 chars, uppercase, lowercase and number"
              required
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOwnerOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateOwner}
            disabled={createOwnerMutation.isPending}
          >
            {createOwnerMutation.isPending ? 'Saving...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
