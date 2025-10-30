import { useMemo } from 'react';
import { NavItemBaseProps } from '@/src/components/nav-section';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

// const icon = (name: string) => (
//   <SvgColor
//     src={`/assets/icons/navbar/${name}.svg`}
//     sx={{ width: 1, height: 1 }}
//   />
//   // OR
//   // <Iconify icon="fluent:mail-24-filled" />
//   // https://icon-sets.iconify.design/solar/
//   // https://www.streamlinehq.com/icons
// );
const icon = (name: string) => {
  if (name.includes('ic_')) {
    return (
      <SvgColor
        src={`/assets/icons/navbar/${name}.svg`}
        sx={{ width: 1, height: 1 }}
      />
    );
  }

  if (name.includes(':')) {
    return <Iconify icon={name} sx={{ width: 1, height: 1 }} />;
  }

  // Puedes cambiar el default a lo que prefieras, o lanzar un error, o retornar un icono por defecto.
  return (
    <SvgColor
      src={`/assets/icons/navbar/${name}.svg`}
      sx={{ width: 1, height: 1 }}
    />
  );
};

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  users: icon('mdi:users'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  // paw: icon('ph:paw-print-light'),
  paw: icon('tabler:paw'),
  grooming: icon('streamline-sharp:pet-friendly-hotel'),
  hospital: icon('tabler:building-hospital'),
  QR_code: icon('lucide:qr-code'),
  catalogs: icon('carbon:catalog-publish'),
  seo: icon('hugeicons:seo'),
  blogPanel: icon('meteor-icons:blogger'),
  inventory: icon('material-symbols:inventory'),
};

const filterByRole = (
  items: NavItemBaseProps[],
  userRole: string
): NavItemBaseProps[] =>
  items
    .filter((item: NavItemBaseProps) => {
      if (item.disabled) return false;

      if (!item.roles) return true;

      return item.roles.includes(userRole);
    })
    .map((item: NavItemBaseProps) => {
      if (item.children && Array.isArray(item.children)) {
        return {
          ...item,
          children: filterByRole(item.children, userRole),
        };
      }
      return item;
    });

// ----------------------------------------------------------------------

export function useNavData(userRole: string) {
  const { t } = useTranslate();

  const data = useMemo(() => {
    const allNavData: { subheader: string; items: NavItemBaseProps[] }[] = [
      //     // OVERVIEW
      {
        subheader: t('Admin'),
        items: [
          {
            // title: t('app'),
            title: 'Panel Principal',
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
            roles: ['admin'],
          },
          // {
          //   title: 'Panel Inventarios',
          //   path: paths.dashboard.admin.inventory.root,
          //   icon: ICONS.inventory,
          //   roles: ['admin'],
          // },
          {
            title: 'Lista de Productos',
            path: paths.dashboard.admin.product.root,
            icon: ICONS.product,
            roles: ['admin'],
          },
          {
            title: 'Lista de Usuarios',
            path: paths.dashboard.admin.usersAdmin,
            icon: ICONS.users,
            roles: ['admin'],
          },
          // {
          //   title: 'Lista de Groomers',
          //   path: paths.dashboard.admin.groomersAdmin,
          //   icon: ICONS.grooming,
          //   roles: ['admin'],
          // },
          // {
          //   title: 'Lista de Veterinarias',
          //   path: paths.dashboard.admin.veterinarianAdmin,
          //   icon: ICONS.paw,
          //   roles: ['admin'],
          // },
          {
            title: 'QR Panel',
            path: paths.dashboard.admin.qrPanel,
            icon: ICONS.QR_code,
            roles: ['admin'],
          },
          {
            title: 'Seo Panel',
            path: paths.dashboard.admin.seoAdmin,
            icon: ICONS.seo,
            roles: ['admin'],
          },
          // {
          //   title: 'Blog Panel',
          //   path: paths.dashboard.admin.blogPanel,
          //   icon: ICONS.blogPanel,
          //   roles: ['admin'],
          // },
          // {
          //   title: t('ecommerce'),
          //   path: paths.dashboard.general.ecommerce,
          //   icon: ICONS.ecommerce,
          // },
          // {
          //   title: t('analytics'),
          //   path: paths.dashboard.general.analytics,
          //   icon: ICONS.analytics,
          // },
          // {
          //   title: t('banking'),
          //   path: paths.dashboard.general.banking,
          //   icon: ICONS.banking,
          // },
          // {
          //   title: t('booking'),
          //   path: paths.dashboard.general.booking,
          //   icon: ICONS.booking,
          // },
          // {
          //   title: t('file'),
          //   path: paths.dashboard.general.file,
          //   icon: ICONS.file,
          // },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: t('overview'),
        items: [
          // USER
          {
            // title: t('app'),
            title: 'Panel Principal',
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
            roles: ['client'],
          },
          {
            title: 'Account',
            path: paths.dashboard.user.account,
            icon: ICONS.user,
            //  children: [
            // { title: t('profile'), path: paths.dashboard.user.root },
            // { title: t('cards'), path: paths.dashboard.user.cards },
            // { title: t('list'), path: paths.dashboard.user.list },
            // { title: t('create'), path: paths.dashboard.user.new },
            // { title: t('edit'), path: paths.dashboard.user.demo.edit },
            // { title: t('account'), path: paths.dashboard.user.account },
            //  ],
          },
          {
            // title: t('app'),
            title: 'My Pets',
            path: paths.dashboard.user.myPets,
            icon: ICONS.paw,
            roles: ['admin', 'client'],
          },

          // PRODUCT
          // {
          //   title: t('product'),
          //   path: paths.dashboard.product.root,
          //   icon: ICONS.product,
          //   children: [
          //     { title: t('list'), path: paths.dashboard.product.root },
          //     {
          //       title: t('details'),
          //       path: paths.dashboard.product.demo.details,
          //     },
          //     { title: t('create'), path: paths.dashboard.product.new },
          //     { title: t('edit'), path: paths.dashboard.product.demo.edit },
          //   ],
          // },

          // ORDER
          // {
          //   title: t('order'),
          //   path: paths.dashboard.order.root,
          //   icon: ICONS.order,
          //   children: [
          //     { title: t('list'), path: paths.dashboard.order.root },
          //     { title: t('details'), path: paths.dashboard.order.demo.details },
          //   ],
          // },

          // INVOICE
          // {
          //   title: t('invoice'),
          //   path: paths.dashboard.invoice.root,
          //   icon: ICONS.invoice,
          //   children: [
          //     { title: t('list'), path: paths.dashboard.invoice.root },
          //     {
          //       title: t('details'),
          //       path: paths.dashboard.invoice.demo.details,
          //     },
          //     { title: t('create'), path: paths.dashboard.invoice.new },
          //     { title: t('edit'), path: paths.dashboard.invoice.demo.edit },
          //   ],
          // },

          // BLOG
          // {
          //   title: t('blog'),
          //   path: paths.dashboard.post.root,
          //   icon: ICONS.blog,
          //   children: [
          //     { title: t('list'), path: paths.dashboard.post.root },
          //     { title: t('details'), path: paths.dashboard.post.demo.details },
          //     { title: t('create'), path: paths.dashboard.post.new },
          //     { title: t('edit'), path: paths.dashboard.post.demo.edit },
          //   ],
          // },

          // JOB
          // {
          //   title: t('job'),
          //   path: paths.dashboard.job.root,
          //   icon: ICONS.job,
          //   children: [
          //     { title: t('list'), path: paths.dashboard.job.root },
          //     { title: t('details'), path: paths.dashboard.job.demo.details },
          //     { title: t('create'), path: paths.dashboard.job.new },
          //     { title: t('edit'), path: paths.dashboard.job.demo.edit },
          //   ],
          // },

          // TOUR
          // {
          //   title: t('tour'),
          //   path: paths.dashboard.tour.root,
          //   icon: ICONS.tour,
          //   children: [
          //     { title: t('list'), path: paths.dashboard.tour.root },
          //     { title: t('details'), path: paths.dashboard.tour.demo.details },
          //     { title: t('create'), path: paths.dashboard.tour.new },
          //     { title: t('edit'), path: paths.dashboard.tour.demo.edit },
          //   ],
          // },

          // FILE MANAGER
          // {
          //   title: t('file_manager'),
          //   path: paths.dashboard.fileManager,
          //   icon: ICONS.folder,
          // },

          // MAIL
          // {
          //   title: t('mail'),
          //   path: paths.dashboard.mail,
          //   icon: ICONS.mail,
          //   info: <Label color="error">+32</Label>,
          // },

          // CHAT
          // {
          //   title: t('chat'),
          //   path: paths.dashboard.chat,
          //   icon: ICONS.chat,
          // },

          // CALENDAR
          {
            title: t('calendar'),
            path: paths.dashboard.calendar,
            icon: ICONS.calendar,
          },

          // KANBAN
          // {
          //   title: t('kanban'),
          //   path: paths.dashboard.kanban,
          //   icon: ICONS.kanban,
          // },
        ],
      },

      // DEMO MENU STATES
      // {
      //   subheader: t(t('other_cases')),
      //   items: [
      //     {
      //       // default roles : All roles can see this entry.
      //       // roles: ['user'] Only users can see this item.
      //       // roles: ['admin'] Only admin can see this item.
      //       // Reference from 'src/guards/RoleBasedGuard'.
      //       title: t('item_by_roles'),
      //       path: paths.dashboard.permission,
      //       icon: ICONS.lock,
      //       roles: ['admin', 'user'],
      //       caption: t('only_admin_can_see_this_item'),
      //     },
      //     {
      //       title: t('menu_level'),
      //       path: '#/dashboard/menu_level',
      //       icon: ICONS.menuItem,
      //       children: [
      //         {
      //           title: t('menu_level_1a'),
      //           path: '#/dashboard/menu_level/menu_level_1a',
      //         },
      //         {
      //           title: t('menu_level_1b'),
      //           path: '#/dashboard/menu_level/menu_level_1b',
      //           children: [
      //             {
      //               title: t('menu_level_2a'),
      //               path: '#/dashboard/menu_level/menu_level_1b/menu_level_2a',
      //             },
      //             {
      //               title: t('menu_level_2b'),
      //               path: '#/dashboard/menu_level/menu_level_1b/menu_level_2b',
      //               children: [
      //                 {
      //                   title: t('menu_level_3a'),
      //                   path: '#/dashboard/menu_level/menu_level_1b/menu_level_2b/menu_level_3a',
      //                 },
      //                 {
      //                   title: t('menu_level_3b'),
      //                   path: '#/dashboard/menu_level/menu_level_1b/menu_level_2b/menu_level_3b',
      //                 },
      //               ],
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //     {
      //       title: t('item_disabled'),
      //       path: '#disabled',
      //       icon: ICONS.disabled,
      //       disabled: true,
      //     },
      //     {
      //       title: t('item_label'),
      //       path: '#label',
      //       icon: ICONS.label,
      //       info: (
      //         <Label
      //           color="info"
      //           startIcon={<Iconify icon="solar:bell-bing-bold-duotone" />}
      //         >
      //           NEW
      //         </Label>
      //       ),
      //     },
      //     {
      //       title: t('item_caption'),
      //       path: '#caption',
      //       icon: ICONS.menuItem,
      //       caption:
      //         'Quisque malesuada placerat nisl. In hac habitasse platea dictumst. Cras id dui. Pellentesque commodo eros a enim. Morbi mollis tellus ac sapien.',
      //     },
      //     {
      //       title: t('item_external_link'),
      //       path: 'https://www.google.com/',
      //       icon: ICONS.external,
      //     },
      //     {
      //       title: t('blank'),
      //       path: paths.dashboard.blank,
      //       icon: ICONS.blank,
      //     },
      //   ],
      // },

      // ... otras secciones
    ];

    // Filtrar por rol y luego eliminar secciones vacías
    return allNavData
      .map((section) => ({
        ...section,
        items: filterByRole(section.items, userRole),
      }))
      .filter((section) => section.items.length > 0);
  }, [t, userRole]);

  return data;
}
