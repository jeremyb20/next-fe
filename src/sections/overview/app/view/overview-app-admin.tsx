'use client';

import { useManagerUser } from '@/src/hooks/use-manager-user';
import { processByMonthData } from '@/src/utils/chart-data-processor';
import {
  useGetPetStats,
  useGetUserStats,
  useGetPetGrowth,
  useGetUserGrowth,
  useGetProductGrowth,
  useGetAdminProductStats,
} from '@/src/hooks/use-fetch';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

import { SeoIllustration } from 'src/assets/illustrations';
import { _appRelated, _appFeatured, _appInstalled } from 'src/_mock';

import AppWidget from '../app-widget';
import AppWelcome from '../app-welcome';
import AppFeatured from '../app-featured';
import AppTopRelated from '../app-top-related';
import AppAreaInstalled from '../app-area-installed';
import AppWidgetSummary from '../app-widget-summary';
import AppCurrentDownload from '../app-current-download';
import AppTopInstalledCountries from '../app-top-installed-countries';

export default function OverviewAppAdmin() {
  const { user } = useManagerUser();
  const theme = useTheme();

  const { data: userStats, isFetching: isFetchingUserStats } =
    useGetUserStats();

  const { data: userGrowth } = useGetUserGrowth();

  const { data: userPetStats } = useGetPetStats();

  const { data: userPetGrowth } = useGetPetGrowth();

  const { data: adminProductStats } = useGetAdminProductStats();

  const { data: productGrowth } = useGetProductGrowth();

  // Procesar datos para gráficos
  const userChartData = processByMonthData(userStats?.byMonth, 6);
  const petChartData = processByMonthData(userPetStats?.byMonth, 6);
  const productChartData = processByMonthData(adminProductStats?.byMonth, 6);

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        <AppWelcome
          title={`Welcome back 👋 \n ${user?.displayName}`}
          description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
          img={<SeoIllustration />}
          action={
            <Button variant="contained" color="primary">
              Go Now
            </Button>
          }
        />
      </Grid>

      <Grid xs={12} md={4}>
        <AppFeatured list={_appFeatured} />
      </Grid>

      <Grid xs={12} md={4}>
        <AppWidgetSummary
          title="Total Active Users"
          subtitle={`${userGrowth?.newThisMonth || 0} new this month`}
          percent={userGrowth?.monthlyGrowth}
          total={userStats?.totalUsers || 0}
          chart={{
            series: userChartData.currentYearData.slice(-6), // Últimos 6 meses
          }}
        />
      </Grid>

      <Grid xs={12} md={4}>
        <AppWidgetSummary
          title="Total Pets Registered"
          subtitle={`${userPetGrowth?.newThisMonth || 0} new this month`}
          percent={userPetGrowth?.monthlyGrowth}
          total={userPetStats?.totalPets || 0}
          chart={{
            colors: [theme.palette.info.light, theme.palette.info.main],
            series: petChartData.currentYearData.slice(-6),
          }}
        />
      </Grid>

      <Grid xs={12} md={4}>
        <AppWidgetSummary
          title="Total Products Registered"
          subtitle={`${productGrowth?.newThisMonth || 0} new this month`}
          percent={productGrowth?.monthlyGrowth}
          total={adminProductStats?.totalProducts || 0}
          chart={{
            colors: [theme.palette.warning.light, theme.palette.warning.main],
            series: productChartData.currentYearData.slice(-6),
          }}
        />
      </Grid>

      <Grid xs={12} md={6} lg={4}>
        {/* Gráfico de Usuarios */}
        <AppAreaInstalled
          title="User Registrations"
          subheader="Last 6 months"
          chart={{
            categories: userChartData.categories,
            series: [
              {
                year: `${new Date().getFullYear()}`,
                data: [
                  {
                    name: 'Users',
                    data: userChartData.currentYearData,
                  },
                ],
              },
              {
                year: `${new Date().getFullYear() - 1}`,
                data: [
                  {
                    name: 'Users',
                    data: userChartData.lastYearData,
                  },
                ],
              },
            ],
          }}
        />
      </Grid>

      <Grid xs={12} md={6} lg={4}>
        {/* Gráfico de Mascotas */}
        <AppAreaInstalled
          title="Pet Registrations"
          subheader="Last 6 months"
          chart={{
            categories: petChartData.categories,
            colors: [
              [theme.palette.info.light, theme.palette.info.main],
              [theme.palette.info.light, theme.palette.info.main],
            ],
            series: [
              {
                year: `${new Date().getFullYear()}`,
                data: [
                  {
                    name: 'Pets',
                    data: petChartData.currentYearData,
                  },
                ],
              },
              {
                year: `${new Date().getFullYear() - 1}`,
                data: [
                  {
                    name: 'Pets',
                    data: petChartData.lastYearData,
                  },
                ],
              },
            ],
          }}
        />
      </Grid>

      <Grid xs={12} md={6} lg={4}>
        {/* Gráfico de Productos */}
        <AppAreaInstalled
          title="Product Registrations"
          subheader="Last 6 months"
          chart={{
            categories: productChartData.categories,
            colors: [
              [theme.palette.warning.light, theme.palette.warning.main],
              [theme.palette.warning.light, theme.palette.warning.main],
            ],
            series: [
              {
                year: `${new Date().getFullYear()}`,
                data: [
                  {
                    name: 'Products',
                    data: productChartData.currentYearData,
                  },
                ],
              },
              {
                year: `${new Date().getFullYear() - 1}`,
                data: [
                  {
                    name: 'Products',
                    data: productChartData.lastYearData,
                  },
                ],
              },
            ],
          }}
        />
      </Grid>

      {/* Alternativa: Gráfico combinado */}
      <Grid xs={12} md={12} lg={8}>
        <AppAreaInstalled
          title="All Registrations Comparison"
          subheader="Current Year vs Last Year"
          initialKey="Users"
          chart={{
            categories: userChartData.categories,
            colors: [
              [theme.palette.primary.light, theme.palette.primary.main],
              [theme.palette.info.light, theme.palette.info.main],
              [theme.palette.warning.light, theme.palette.warning.main],
            ],
            series: [
              {
                year: 'Users',
                data: [
                  {
                    name: 'Current Year',
                    data: userChartData.currentYearData,
                  },
                  {
                    name: 'Last Year',
                    data: userChartData.lastYearData,
                  },
                ],
              },
              {
                year: 'Pets',
                data: [
                  {
                    name: 'Current Year',
                    data: petChartData.currentYearData,
                  },
                  {
                    name: 'Last Year',
                    data: petChartData.lastYearData,
                  },
                ],
              },
              {
                year: 'Products',
                data: [
                  {
                    name: 'Current Year',
                    data: productChartData.currentYearData,
                  },
                  {
                    name: 'Last Year',
                    data: productChartData.lastYearData,
                  },
                ],
              },
            ],
          }}
        />
      </Grid>

      <Grid xs={12} md={6} lg={4}>
        <AppCurrentDownload
          title="All Registrations Comparison"
          chart={{
            series: [
              {
                label: 'Total Active Users',
                value: userStats?.totalUsers || 0,
              },
              {
                label: 'Total Pets Registered',
                value: userPetStats?.totalPets || 0,
              },
              {
                label: 'Total Products Registered',
                value: adminProductStats?.totalProducts || 0,
              },
            ],
          }}
        />
      </Grid>

      {/* <Grid xs={12} lg={8}>
        <AppNewInvoice
          title="New Invoice"
          tableData={_appInvoices}
          tableLabels={[
            { id: 'id', label: 'Invoice ID' },
            { id: 'category', label: 'Category' },
            { id: 'price', label: 'Price' },
            { id: 'status', label: 'Status' },
            { id: '' },
          ]}
        />
      </Grid> */}

      <Grid xs={12} md={6} lg={4}>
        <AppTopRelated
          title="Products by Category"
          list={
            adminProductStats?.byCategory?.map((cat: any) => ({
              id: cat._id,
              name: cat._id,
              system: cat._id,
              price: cat.avgPrice,
              rating: cat.count,
              review: cat.totalValue,
              coverUrl: `/assets/images/categories/${
                cat._id?.toLowerCase() || 'default'
              }.jpg`,
            })) || _appRelated
          }
        />
      </Grid>

      <Grid xs={12} md={6} lg={4}>
        <AppTopInstalledCountries
          title="User Types Distribution"
          list={
            userStats?.byType?.map((type: any) => ({
              id: type._id,
              name: type._id,
              android: type.count,
              windows: 0,
              apple: 0,
            })) || _appInstalled
          }
        />
      </Grid>

      <Grid xs={12} md={6} lg={4}>
        <Stack spacing={2} direction="row">
          <AppWidget
            title="Stock Alert"
            total={adminProductStats?.lowStock || 0}
            subtitle="Products with low stock"
            icon="mdi:package-variant-alert"
            color="warning"
            chart={{
              series: adminProductStats?.totalProducts
                ? Math.round(
                    ((adminProductStats.lowStock || 0) /
                      adminProductStats.totalProducts) *
                      100
                  )
                : 0,
            }}
          />

          <AppWidget
            title="Out of Stock"
            total={adminProductStats?.outOfStock || 0}
            subtitle="Products to restock"
            icon="mdi:package-variant-remove"
            color="error"
            chart={{
              series: adminProductStats?.totalProducts
                ? Math.round(
                    ((adminProductStats.outOfStock || 0) /
                      adminProductStats.totalProducts) *
                      100
                  )
                : 0,
            }}
          />
        </Stack>
      </Grid>
    </Grid>
  );
}
