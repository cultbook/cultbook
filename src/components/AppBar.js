import React, { useState, forwardRef } from 'react';
import { useWebId } from "@solid/react"
import { ldp } from 'rdf-namespaces'
import { useDocument } from "../data"
import { useModel } from "../model"
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { useHistory } from "react-router-dom";


import Link from "./Link"
import ButtonLink from "./ButtonLink"
import {LogoutMenuItem} from "./LogoutButton"

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "#202020"
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontFamily: "gothicus, serif",
    fontSize: 66,
    lineHeight: 1.2,
    textAlign: "left"
  },
  notificationsLink: {
    color: "inherit"
  },
  logo: {
    color: "#ac5858",
    '&:hover': {
      textDecoration: "none"
    }
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}));

const NotificationsIconButton = ({notificationsCount}) => (
  <IconButton aria-label={`show ${notificationsCount} new notifications`} color="inherit">
    <Badge badgeContent={notificationsCount} color="secondary">
      <NotificationsIcon />
    </Badge>
  </IconButton>
)

const LinkMenuItem = ({to, onClick, ...props}) => {
  const history = useHistory();
  const navigate = () => {
    history.push(to)
    onClick && onClick()
  }
  return (
    <MenuItem onClick={navigate} {...props}/>
  )

}

const MeMenuItem = (props) => (
  <LinkMenuItem to="/me">
    Me
  </LinkMenuItem>
)

const MyCultMenuItem = () => (
  <LinkMenuItem to="/me/cult">
    My Cult
  </LinkMenuItem>
)

export default function CultbookAppBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MeMenuItem onClick={handleMenuClose}/>
      <MyCultMenuItem onClick={handleMenuClose}/>
      <LogoutMenuItem/>
    </Menu>
  );

  const webId = useWebId()
  const { inboxContainer } = useModel(webId)
  const [ inboxContainerDoc ] = useDocument(inboxContainer)

  const inbox = inboxContainerDoc && inboxContainerDoc.getSubject(inboxContainerDoc.asRef())
  const notifications = inbox && inbox.getAllRefs(ldp.contains)
  const notificationsCount = notifications && notifications.length
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
      <Link to="/notifications" className={classes.notificationsLink}>
        <MenuItem>
          <NotificationsIconButton notificationsCount={notificationsCount}/>
          <p>Notifications</p>
        </MenuItem>
      </Link>
      <MeMenuItem onClick={handleMenuClose}/>
      <MyCultMenuItem onClick={handleMenuClose}/>
      <LogoutMenuItem/>
    </Menu>
  );
  return (
    <div className={classes.grow}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            <Link className={classes.logo} to="/">cultbook</Link>
          </Typography>
          <div className={classes.sectionDesktop}>
            <Link to="/notifications" className={classes.notificationsLink}>
              <NotificationsIconButton notificationsCount={notificationsCount}/>
            </Link>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
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
  );
}
