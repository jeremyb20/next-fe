// components/UsersList.tsx
import React, { useState } from 'react';
import Iconify from '@/src/components/iconify';
import { useGetAllRegisteredUsers } from '@/src/hooks/use-fetch-paginates';

import {
  Box,
  Card,
  Chip,
  List,
  Alert,
  Paper,
  Select,
  Divider,
  MenuItem,
  ListItem,
  Accordion,
  Typography,
  Pagination,
  InputLabel,
  CardContent,
  FormControl,
  ListItemText,
  CircularProgress,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

const UsersList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isError, error, isPlaceholderData } =
    useGetAllRegisteredUsers(currentPage, pageSize);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const handlePageSizeChange = (event: any) => {
    setPageSize(event.target.value);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading users: {error?.message}
      </Alert>
    );
  }

  if (!data || data.payload.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No users found
        </Typography>
      </Paper>
    );
  }

  console.log('Fetched Users Data:', data);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with title and page size selector */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Users Management
        </Typography>

        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Page Size</InputLabel>
          <Select
            value={pageSize}
            label="Page Size"
            onChange={handlePageSizeChange}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Users List */}
      <Box display="flex" flexDirection="row" gap={2} mb={3}>
        {data.payload.map((user) => (
          <Card key={user.id} variant="outlined">
            <CardContent>
              {/* User Header */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                mb={2}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Iconify icon="mdi:email-outline" />
                  <Typography variant="h6" component="h2">
                    {user.email}
                  </Typography>
                </Box>

                <Box display="flex" gap={1}>
                  <Chip
                    label={user.petStatus}
                    color={user.petStatus === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                  <Chip
                    label={user.userState}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>

              {/* User Details */}
              <Box display="flex" gap={3} mb={2}>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Iconify
                    icon="mdi:account-outline"
                    fontSize="small"
                    color="action"
                  />
                  <Typography variant="body2" color="textSecondary">
                    Created: {new Date(user.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Iconify
                    icon="mdi:account-outline"
                    fontSize="small"
                    color="action"
                  />
                  <Typography variant="body2" color="textSecondary">
                    Updated: {new Date(user.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              {/* Pet Profiles Accordion */}
              {user.newPetProfile && user.newPetProfile.length > 0 && (
                <Accordion>
                  <AccordionSummary
                    expandIcon={<Iconify icon="iconoir:expand" />}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Iconify icon="famicons:paw-outline" color="secondary" />
                      <Typography variant="subtitle1">
                        Pet Profiles ({user.newPetProfile.length})
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {user.newPetProfile.map((pet, index) => (
                        <React.Fragment key={pet.idParental}>
                          <ListItem>
                            <ListItemText
                              primary={
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  gap={1}
                                  mb={1}
                                >
                                  <Typography variant="subtitle2">
                                    {pet.petName}
                                  </Typography>
                                  <Chip
                                    label={
                                      pet.isDigitalIdentificationActive
                                        ? 'Digital ID Active'
                                        : 'Digital ID Inactive'
                                    }
                                    color={
                                      pet.isDigitalIdentificationActive
                                        ? 'success'
                                        : 'default'
                                    }
                                    size="small"
                                  />
                                </Box>
                              }
                              secondary={
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  gap={0.5}
                                >
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                  >
                                    <Iconify
                                      icon="solar:user-outline"
                                      fontSize="small"
                                      color="action"
                                    />
                                    <Typography variant="body2">
                                      Owner: {pet.ownerPetName}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                  >
                                    Phone: {pet.phone} | Age: {pet.age} | Birth:{' '}
                                    {new Date(
                                      pet.birthDate
                                    ).toLocaleDateString()}
                                  </Typography>
                                  {/* <Typography
                                    variant="body2"
                                    color="textSecondary"
                                  >
                                    Views: {pet.petViewCounter} | Status:{' '}
                                    {pet.petStatus}
                                  </Typography> */}
                                </Box>
                              }
                            />
                          </ListItem>
                          {index < user.newPetProfile!.length - 1 && (
                            <Divider />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              )}

              {(!user.newPetProfile || user.newPetProfile.length === 0) && (
                <Box display="flex" alignItems="center" gap={1} mt={1}>
                  <Iconify icon="famicons:paw-outline" color="disabled" />
                  <Typography variant="body2" color="textSecondary">
                    No pet profiles
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Pagination */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={3}
      >
        <Typography variant="body2" color="textSecondary">
          Showing {data.payload.length} of {data.total} users
          {isPlaceholderData && ' (Loading...)'}
        </Typography>

        <Pagination
          count={data.totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
          disabled={isPlaceholderData}
        />

        <Typography variant="body2" color="textSecondary">
          Page {data.currentPage} of {data.totalPages}
        </Typography>
      </Box>
    </Box>
  );
};

export default UsersList;
