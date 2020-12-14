
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import PeopleOutline from "@material-ui/icons/PeopleOutline";
import Category from "@material-ui/icons/Category";
import ShoppingBasket from "@material-ui/icons/ShoppingBasket";
import SettingsIcon from '@material-ui/icons/Settings';

const dashboardRoutes = [
  {
    path: "/",
    name: "Dashboard",
    icon: Dashboard,
  },
  {
    icon: Category,
    name: 'Categories',
    path: '/categories',
  },
  {
    icon: ShoppingBasket,
    name: 'Products',
    path: '/products',
  },
  {
    icon: PeopleOutline,
    name: 'Users',
    path: '/users',
  },
  {
    icon: SettingsIcon,
    name: 'Settings',
    path: '/settings',
  },
];

export default dashboardRoutes;
