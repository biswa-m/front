const sidebarMenu = {
  header: {
    id: 'pro_settings',
    label: 'Pro Settings',
    permissions: ['pro'],
  },
  links: [
    {
      id: 'general',
      label: 'General',
    },
    {
      id: 'theme',
      label: 'Theme',
    },
    {
      id: 'assets',
      label: 'Assets',
    },
    {
      id: 'hashtags',
      label: 'Hashtags',
    },
    {
      id: 'footer',
      label: 'Footer',
    },
    {
      id: 'domain',
      label: 'Domain',
    },
    {
      id: 'payouts',
      label: 'Payouts',
    },
    {
      id: 'subscription',
      label: 'Pro Subscription',
      path: 'pro',
    },
    {
      id: ':username',
      label: 'View Pro Channel',
      path: 'pro/:username',
      newWindow: true,
    },
  ],
};

export default sidebarMenu;
