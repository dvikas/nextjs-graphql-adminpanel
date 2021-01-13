import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';


import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import NotificationsIcon from '@material-ui/icons/Notifications';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';

import routes from "../../routes.js";
import { useRouter } from "next/router";
import Link from "next/link";
import Icon from "@material-ui/core/Icon";
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';

import HeaderUserbox from './HeaderUserBox';

export const drawerWidth = 240;
export const miniDrawerWidth = 140;

var classNames = require('classnames');

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
      marginLeft: 10,
    },
    hide: {
      display: 'none',
    },
    pageTitle: {
      textTransform: "capitalize"
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      backgroundColor: '#f8f9fc'
    },
    item: {
      position: "relative",
      display: "block",
      textDecoration: "none",
      "&:hover,&:focus,&:visited,&": {
        color: "#000",
      },
    },
    itemLink: {
      display: "flex",
      overflow: "hidden",
      width: "auto",
      transition: "all 300ms linear",
      margin: "10px 0",
      position: "relative",
      padding: "10px 15px",
      backgroundColor: "transparent",
      // ...defaultFont,
    },
    itemIcon: {
      width: "24px",
      height: "30px",
      fontSize: "24px",
      lineHeight: "30px",
      float: "left",
      marginRight: "15px",
      textAlign: "center",
      verticalAlign: "middle",
      color: "rgba('0,0,0', 0.8)",
    },
    itemText: {
      // ...defaultFont,
      margin: "0",
      lineHeight: "30px",
      fontSize: "14px",
      color: '#000',
    },
    selectedMenu: {
      color: theme.palette.primary.dark,
      backgroundColor: theme.palette.grey[300],
    },
    logoImage: {
      width: "30px",
      display: "inline-block",
      maxHeight: "30px",
      // marginLeft: "10px",
      marginRight: "15px",
    },
    headerToolbar: {
      padding: '0 10px'
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    grow: {
      flexGrow: 1,
    },
  }),
);


const heading = (path: string) => {
  const line1 = path.replace('/', '') //remove first slash
  const line2 = line1.replace(/\//g, ' > ') // replace other slash with >
  const line3 = line2.replace(/-/g, ' ') // replace other slash with >
  return line3
}

// export default function MiniDrawer() {
type Props = {};
const Layout: React.FC<Props> = ({ children, ...rest }) => {
  const router = useRouter();
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName: any) {
    return router.pathname === routeName ? true : false;
  }

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const color = "white";
  ///////////////////////////////////////////////////////////
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

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
  const mobileMenuId = 'primary-search-account-menu-mobile';

  ///////////////////////////////////////////////////////////
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar className={classes.headerToolbar}>

          <Avatar
            className={clsx({
              [classes.hide]: open,
            })}
            alt="Brand" src="/images/adminLogo.png" />

          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap className={classes.pageTitle}>
            {heading(router.pathname)}
          </Typography>
          {/* <div style={{ paddingLeft: '20px' }}>
            If you like this project and want to help, <strong>please give a star ⭐️on Github.</strong>&nbsp;&nbsp;&nbsp;

            <iframe src="https://ghbtns.com/github-btn.html?user=dvikas&repo=nextjs-graphql-adminpanel&type=star&count=true"
              style={{ border: 0 }}
              scrolling="0" width="90" height="20" title="GitHub"></iframe>
            <iframe src="https://ghbtns.com/github-btn.html?user=dvikas&repo=nextjs-graphql-adminpanel&type=fork&count=true"
              style={{ border: 0 }}
              scrolling="0" width="90" height="20" title="GitHub"></iframe>
          </div> */}
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>

            <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>

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
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >

        <Box className={classes.toolbar} color="text.primary" style={{ justifyContent: 'space-evenly' }} >
          <Avatar alt="Brand" src="/images/adminLogo.png" />
          <Typography variant="h5">&nbsp;Next Admin</Typography>
          <Grid style={{ justifyContent: 'flex-end' }}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Grid>
        </Box>

        <Divider />

        <List>

          {routes.map((prop: any, key: any) => {

            var listItemClasses;
            listItemClasses = classNames({
              [" " + classes.selectedMenu]: activeRoute(prop.path),
            });
            const whiteFontClasses = classNames({
              [" " + classes.selectedMenu]:
                activeRoute(prop.path),
            });
            return (
              <Link href={prop.path} passHref key={key}>
                <a className={classes.item}>

                  <ListItem button key={key} className={listItemClasses}>
                    <ListItemIcon>
                      {typeof prop.icon === "string" ? (
                        <Icon className={classNames(whiteFontClasses)}>
                          {prop.icon}
                        </Icon>
                      ) : (
                          <prop.icon />
                        )}
                    </ListItemIcon>
                    <ListItemText primary={prop.name} />
                  </ListItem>
                </a>
              </Link>
            );
          })}

        </List>

      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
}
export default Layout;
