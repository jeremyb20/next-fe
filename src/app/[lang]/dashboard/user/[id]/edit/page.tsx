// import { _userList } from '@/_mock/_user';

import { Metadata } from 'next';

// import { UserEditView } from '@/sections/user/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Dashboard: User Edit',
};

type Props = {
  params: {
    id: string;
  };
};

export default function UserEditPage({ params: _params }: Props) {
  // const { id } = params;

  // return <UserEditView id={id} />;
  return <>UserEditView</>;
}

// export async function generateStaticParams() {
//   return _userList.map((user) => ({
//     id: user.id,
//   }));
// }
