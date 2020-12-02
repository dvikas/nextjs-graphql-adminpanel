import React from 'react';
import { useApolloClient, useQuery, useMutation } from '@apollo/react-hooks';
import ApolloClient from 'apollo-client';
import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
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

// import { Query, Mutation } from "react-apollo";
// import { LEFT_DRAWER_STATE_QUERY } from '../../../query';
// import { TOGGLE_LEFT_DRAWER_MUTATION } from '../../../mutation';
// import { adopt } from "react-adopt";
var classNames = require('classnames');

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawerOpen: {
      width: `calc(100% - ${drawerWidth}px)`,
      // transition: theme.transitions.create('width', {
      //   easing: theme.transitions.easing.sharp,
      //   duration: theme.transitions.duration.enteringScreen,
      // }),
    },
    drawerClose: {
      width: `calc(100% - ${miniDrawerWidth}px)`,
      // transition: theme.transitions.create('width', {
      //   easing: theme.transitions.easing.sharp,
      //   duration: theme.transitions.duration.leavingScreen,
      // }),
      overflowX: 'hidden',
    },
    header: {

      // display: 'flex',
      // 'flex-direction': 'row',
      // color: '#fff',
      // top: 0,
      // left: 'auto',
      // right: 0,
      // position: 'fixed',
      // border: "1px solid red",
      // width: `calc(100% - ${drawerWidth}px)`,
    },
    grow: {
      flexGrow: 1,
    },
    appBar: {
      top: 0,
      left: 'auto',
      right: 0,
      position: 'fixed',
      // width: `calc(100% - ${drawerWidth}px)`,

      display: 'flex',
      'background-color': '#3d4977',
      padding: '3px;'
    },
    menuButton: {
      marginRight: '10px',
    },
    title: {
      display: 'block',
      // [theme.breakpoints.up('sm')]: {
      //   display: 'block',
      // },
    },
    // search: {
    //   position: 'relative',
    //   borderRadius: theme.shape.borderRadius,
    //   backgroundColor: fade(theme.palette.common.white, 0.15),
    //   '&:hover': {
    //     backgroundColor: fade(theme.palette.common.white, 0.25),
    //   },
    //   marginRight: theme.spacing(2),
    //   marginLeft: 0,
    //   width: '100%',
    //   [theme.breakpoints.up('sm')]: {
    //     marginLeft: theme.spacing(3),
    //     width: 'auto',
    //   },
    // },
    // searchIcon: {
    //   padding: theme.spacing(0, 2),
    //   height: '100%',
    //   position: 'absolute',
    //   pointerEvents: 'none',
    //   display: 'flex',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    // },
    inputRoot: {
      color: 'inherit',
    },
    // inputInput: {
    //   padding: theme.spacing(1, 1, 1, 0),
    //   // vertical padding + font size from searchIcon
    //   paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    //   transition: theme.transitions.create('width'),
    //   width: '100%',
    //   [theme.breakpoints.up('md')]: {
    //     width: '20ch',
    //   },
    // },
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

// const Composed = adopt({
//   toggleLeftDrawer: ({ render }) => <Mutation mutation={TOGGLE_LEFT_DRAWER_MUTATION}>{render}</Mutation>,
//   localState: ({ render }) => <Query query={LEFT_DRAWER_STATE_QUERY}>{render}</Query>,
// });

export default function Topbar(props: any) {
  // const Topbar = ({ props }: any) => {

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
    <div  >


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



            {/* <div className={classes.search}>
            <div className={classes.searchIcon}>
            <SearchIcon />
            </div>
            <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
            />
          </div> */}
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              {/* <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
                </Badge>
                </IconButton>
                <IconButton aria-label="show 17 new notifications" color="inherit">
                <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
                </Badge>
                </IconButton>
                <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              >
              <AccountCircle />
            </IconButton> */}

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
// export default Topbar;

Topbar.propTypes = {
  open: PropTypes.bool,
};