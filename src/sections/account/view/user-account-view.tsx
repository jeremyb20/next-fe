'use client';

import { paths } from '@/routes/paths';
import Iconify from '@/components/iconify';
import { useTranslation } from '@/hooks/use-translation';
import { useState, useEffect, useCallback } from 'react';
import { useSettingsContext } from '@/components/settings';
import { useRouter, useSearchParams } from 'next/navigation';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';
import {
  _userAbout,
  _userPlans,
  _userPayment,
  _userInvoices,
  _userAddressBook,
} from '@/_mock';

import Tab from '@mui/material/Tab';
import { Box } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import AccountGeneral from '../account-general';
import AccountBilling from '../account-billing';
import AccountSocialLinks from '../account-social-links';
import AccountNotifications from '../account-notifications';
import AccountChangePassword from '../account-change-password';

// ----------------------------------------------------------------------

// Configuración de tabs con sus parámetros de URL
const TABS_CONFIG = [
  {
    value: 'general',
    label: 'General',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
    param: 'general',
  },
  // {
  //   value: 'billing',
  //   label: 'Billing',
  //   icon: <Iconify icon="solar:bill-list-bold" width={24} />,
  //   param: 'billing',
  // },
  // {
  //   value: 'notifications',
  //   label: 'Notifications',
  //   icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
  //   param: 'notifications',
  // },
  // {
  //   value: 'social',
  //   label: 'Social links',
  //   icon: <Iconify icon="solar:share-bold" width={24} />,
  //   param: 'social',
  // },
  {
    value: 'security',
    label: 'Security',
    icon: <Iconify icon="ic:round-vpn-key" width={24} />,
    param: 'security',
  },
];

// Mapeo de parámetros a valores de tabs
const PARAM_TO_TAB_VALUE: Record<string, string> = {
  general: 'general',
  billing: 'billing',
  notifications: 'notifications',
  social: 'social',
  security: 'security',
};

// ----------------------------------------------------------------------

export default function AccountView() {
  const settings = useSettingsContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  // Obtener el parámetro 'tab' de la URL
  const tabParam = searchParams.get('tab');

  // Determinar el tab inicial basado en el parámetro de URL
  const getInitialTab = useCallback(() => {
    if (tabParam && PARAM_TO_TAB_VALUE[tabParam]) {
      return PARAM_TO_TAB_VALUE[tabParam];
    }
    return 'general'; // Default a general
  }, [tabParam]);

  const [currentTab, setCurrentTab] = useState(getInitialTab());

  // Manejador de cambio de tab con actualización de URL
  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);

      // Obtener el parámetro correspondiente al nuevo tab
      const selectedTab = TABS_CONFIG.find((tab) => tab.value === newValue);
      if (selectedTab) {
        // Crear nuevos parámetros de URL
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', selectedTab.param);

        // Actualizar la URL sin recargar la página
        router.replace(`${window.location.pathname}?${params.toString()}`, {
          scroll: false,
        });
      }
    },
    [router, searchParams]
  );

  // Sincronizar el currentTab con el parámetro de URL cuando cambia
  useEffect(() => {
    const newTabValue = getInitialTab();
    if (newTabValue !== currentTab) {
      setCurrentTab(newTabValue);
    }
  }, [tabParam, getInitialTab, currentTab]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Box
        sx={{
          p: 1,
        }}
      >
        <CustomBreadcrumbs
          heading="Account"
          links={[
            { name: 'Inicio', href: paths.dashboard.root },
            { name: 'User', href: paths.dashboard.user.root },
            { name: 'Account' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {TABS_CONFIG.map((tab) => (
            <Tab
              key={tab.value}
              label={t(tab.label)}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>

        {currentTab === 'general' && <AccountGeneral />}

        {currentTab === 'billing' && (
          <AccountBilling
            plans={_userPlans}
            cards={_userPayment}
            invoices={_userInvoices}
            addressBook={_userAddressBook}
          />
        )}

        {currentTab === 'notifications' && <AccountNotifications />}

        {currentTab === 'social' && (
          <AccountSocialLinks socialLinks={_userAbout.socialLinks} />
        )}

        {currentTab === 'security' && <AccountChangePassword />}
      </Box>
    </Container>
  );
}
