'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from '@/routes/paths';
import Label from '@/components/label';
import Iconify from '@/components/iconify';
import { fDate } from '@/utils/format-time';
import EmptyContent from '@/components/empty-content';
import { useClinicalRecord } from '@/hooks/use-veterinary';
import { useSettingsContext } from '@/components/settings';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';

type Props = {
  veterinaryId: string;
  petId: string;
};

export default function ClinicalRecordView({ veterinaryId, petId }: Props) {
  const { data, isLoading } = useClinicalRecord(veterinaryId, petId);
  const settings = useSettingsContext();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const pet = data?.data.pet;
  const record = data?.data.record;

  if (!pet || !record) {
    return (
      <EmptyContent
        filled
        title="Clinical record not available"
        description="The pet may not be associated with this clinic."
        sx={{ py: 10 }}
      />
    );
  }

  const sections = [
    {
      key: 'consultations',
      title: 'Consultations',
      icon: 'solar:stethoscope-linear',
      items: record.consultations,
      titleOf: (item: any) => item.reason,
      subtitleOf: (item: any) => fDate(item.date),
      detailOf: (item: any) =>
        item.diagnosis || item.treatment || item.notes || '',
    },
    {
      key: 'allergies',
      title: 'Allergies',
      icon: 'solar:shield-warning-linear',
      items: record.allergies,
      titleOf: (item: any) => item.name,
      subtitleOf: (item: any) => item.severity || '',
      detailOf: (item: any) => item.reaction || item.notes || '',
    },
    {
      key: 'diseases',
      title: 'Diseases',
      icon: 'solar:heart-pulse-linear',
      items: record.diseases,
      titleOf: (item: any) => item.name,
      subtitleOf: (item: any) => item.status || '',
      detailOf: (item: any) => item.notes || '',
    },
    {
      key: 'medications',
      title: 'Medications',
      icon: 'solar:pill-linear',
      items: record.medications,
      titleOf: (item: any) => item.name,
      subtitleOf: (item: any) =>
        [item.dosage, item.frequency].filter(Boolean).join(' · '),
      detailOf: (item: any) => item.notes || '',
    },
    {
      key: 'treatments',
      title: 'Treatments',
      icon: 'solar:clipboard-heart-linear',
      items: record.treatments,
      titleOf: (item: any) => item.name,
      subtitleOf: (item: any) =>
        [fDate(item.startDate), fDate(item.endDate)]
          .filter((value) => value && value !== 'Invalid Date')
          .join(' - '),
      detailOf: (item: any) => item.description || item.notes || '',
    },
    {
      key: 'surgeries',
      title: 'Surgeries',
      icon: 'solar:medical-kit-linear',
      items: record.surgeries,
      titleOf: (item: any) => item.name,
      subtitleOf: (item: any) => fDate(item.date),
      detailOf: (item: any) =>
        [item.veterinarianName, item.notes].filter(Boolean).join(' · '),
    },
  ];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={pet.petName}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Veterinary Clinic', href: paths.dashboard.veterinary.root },
          { name: 'Clinical record' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h6">{pet.petName}</Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {pet.memberPetId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Owner: {pet.ownerPetName || pet.owner?.name || '-'}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Label variant="soft">{pet.breed || 'No breed'}</Label>
              <Label variant="soft" color="info">
                {pet.genderSelected || 'No gender'}
              </Label>
              <Label variant="soft" color="warning">
                {pet.weight ? `${pet.weight} kg` : 'No weight'}
              </Label>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {sections.map((section) => (
          <Grid key={section.key} size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title={section.title}
                avatar={<Iconify icon={section.icon} width={22} />}
                action={
                  <Label variant="soft" color="default">
                    {section.items?.length ?? 0}
                  </Label>
                }
              />
              <CardContent>
                {section.items?.length ? (
                  <Stack spacing={2}>
                    {section.items.map((item: any) => (
                      <Box
                        key={
                          item._id ?? `${section.key}-${section.titleOf(item)}`
                        }
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          spacing={1}
                        >
                          <Typography variant="subtitle2">
                            {section.titleOf(item) || '-'}
                          </Typography>
                          {section.subtitleOf(item) && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {section.subtitleOf(item)}
                            </Typography>
                          )}
                        </Stack>
                        {section.detailOf(item) && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {section.detailOf(item)}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No records
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {record.notes && (
        <Card sx={{ mt: 3 }}>
          <CardHeader title="Clinical notes" />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {record.notes}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
