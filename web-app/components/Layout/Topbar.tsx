import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import ApolloClient from 'apollo-client';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import MoreIcon from '@material-ui/icons/MoreVert';
import Fade from '@material-ui/core/Fade';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import HeaderUserbox from './HeaderUserBox';
import PropTypes from "prop-types";
import { drawerWidth, miniDrawerWidth } from './Layout';

var classNames = require('classnames');

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawerOpen: {
      width: `calc(100% - ${drawerWidth}px)`
    },
    drawerClose: {
      width: `calc(100% - ${miniDrawerWidth}px)`,
      overflowX: 'hidden',
    },
    grow: {
      flexGrow: 1,
    },
    appBar: {
      top: 0,
      left: 'auto',
      right: 0,
      position: 'fixed',
      display: 'flex',
      'background-color': '#3d4977',
      padding: '3px;'
    },
    menuButton: {
      marginRight: '10px',
    },
    title: {
      display: 'block'
    },

    inputRoot: {
      color: 'inherit',
    },

    sectionDesktop: {
      display: 'flex',
      // [theme.breakpoints.up('md')]: {
      //   display: 'flex',
      // },
    },
    sectionMobile: {
      display: 'flex',
      // [theme.breakpoints.up('md')]: {
      //   display: 'none',
      // },
    },
  }),
);

export default function Topbar(props: any) {

  console.log('props', props)
  const client: ApolloClient<any> = useApolloClient();

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const toggleLeftDrawer = (open: Boolean) => {
    client.writeData({ data: { isLeftDrawerOpen: !open } });
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={isMenuOpen}
      TransitionComponent={Fade}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <ListItemIcon>
          <PriorityHighIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">Profile</Typography>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <ListItemIcon>
          {/* <Icon className="fa fa-plus-circle" /> */}
          {/* <PriorityHighIcon fontSize="small" /> */}
        </ListItemIcon>
        <Typography variant="inherit">My account</Typography>
      </MenuItem>

    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div >
      <div className={classes.grow}>
        <AppBar position="static" className={classNames(classes.appBar, {
          [classes.drawerOpen]: props.open,
          [classes.drawerClose]: !props.open,
        })}>
          <Toolbar>
            <IconButton
              onClick={() => toggleLeftDrawer(props.open)}
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
            >
              <MenuIcon />
            </IconButton>

            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              123
              {/* Show Logged In User Details with Menu  */}
              <HeaderUserbox />

            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </div>
    </div>
  )
}
