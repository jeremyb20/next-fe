'use client';

import { useState, useCallback } from 'react';
import { AccountView } from '@/src/sections/account/view';
import { useManagerUser } from '@/src/hooks/use-manager-user';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProfileCover from '../_components/profile-cover';
// import ProfileFriends from '../_components/profile-friends';
// import ProfileGallery from '../_components/profile-gallery';
// import ProfileFollowers from '../_components/profile-followers';
import UserPetCardsView from '../_components/user-pets-cards-view';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'myPets',
    label: 'My Pets',
    icon: <Iconify icon="solar:paw-bold" width={24} />,
  },
  {
    value: 'profile',
    label: 'Profile',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  // {
  //   value: 'followers',
  //   label: 'Followers',
  //   icon: <Iconify icon="solar:heart-bold" width={24} />,
  // },
  // {
  //   value: 'friends',
  //   label: 'Friends',
  //   icon: <Iconify icon="solar:users-group-rounded-bold" width={24} />,
  // },
  // {
  //   value: 'gallery',
  //   label: 'Gallery',
  //   icon: <Iconify icon="solar:gallery-wide-bold" width={24} />,
  // },
];

// ----------------------------------------------------------------------

export default function UserProfileView() {
  const settings = useSettingsContext();

  const { user } = useManagerUser();

  const [searchFriends, setSearchFriends] = useState('');

  const [currentTab, setCurrentTab] = useState('myPets');

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);
    },
    []
  );

  const handleSearchFriends = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchFriends(event.target.value);
    },
    []
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Profile"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.root },
          { name: user?.displayName },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card
        sx={{
          mb: 3,
          height: 290,
        }}
      >
        <ProfileCover
          role={user.role}
          name={user?.displayName}
          avatarUrl={user?.photoURL}
          coverUrl={user.coverUrl}
          updatedAt={user.updatedAt}
        />

        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: 'absolute',
            bgcolor: 'background.paper',
            [`& .${tabsClasses.flexContainer}`]: {
              pr: { md: 3 },
              justifyContent: {
                sm: 'center',
                md: 'flex-end',
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              icon={tab.icon}
              label={tab.label}
            />
          ))}
        </Tabs>
      </Card>

      {currentTab === 'myPets' && <UserPetCardsView />}

      {currentTab === 'profile' && (
        // <ProfileHome info={_userAbout} posts={_userFeeds} />
        <AccountView />
      )}

      {/* {currentTab === 'followers' && (
        <ProfileFollowers followers={_userFollowers} />
      )}

      {currentTab === 'friends' && (
        <ProfileFriends
          friends={_userFriends}
          searchFriends={searchFriends}
          onSearchFriends={handleSearchFriends}
        />
      )}

      {currentTab === 'gallery' && <ProfileGallery gallery={_userGallery} />} */}
    </Container>
  );
}
