import React, { useContext } from 'react';
import { Link } from 'react-router-dom'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CommentIcon from '@material-ui/icons/Comment';
import { AuthContext } from '../../Context/AuthContext'

const useStyles = makeStyles({
  list: {
    width: 250,
    fontWeight: '700 !important'
  },
  fullList: {
    width: 'auto',
  },
});

export default function MUIDrawer({toggleDrawer, open}) {
  
  const {user, userData, logout}  = useContext(AuthContext)
  const classes = useStyles()

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={() => toggleDrawer(anchor, false)}
      onKeyDown={() => toggleDrawer(anchor, false)}
    >
      {user && <>
      <List>
        <ListItem button >
          <ListItemText class="nav-link" primary={'Hi ' + userData.username} />
        </ListItem>
        <a href='/' style={{textDecoration: 'none', width: '100%', color: 'black', fontWeight: '700'}} >
          <ListItem button onClick={logout} >
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText class="nav-link" primary={'Logout'} />
          </ListItem>
        </a>
      </List>
      <Divider />
      <List>
        <Link to='/' style={{textDecoration: 'none', width: '100%', color: 'black', fontWeight: '700'}} >
          <ListItem button >
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText class="nav-link" primary={'Home'} />
          </ListItem>
        </Link>
        <Link to='/blogs' style={{textDecoration: 'none', width: '100%', color: 'black', fontWeight: '700'}} >
          <ListItem button >
            <ListItemIcon><CommentIcon /></ListItemIcon>
            <ListItemText class="nav-link" primary={'Blogs'} />
          </ListItem>
        </Link>
      </List> </>}
      {!user &&
      <List>
        <Link to='/login' style={{textDecoration: 'none', width: '100%', color: 'black', fontWeight: '700'}} >
          <ListItem button >
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText class="nav-link" primary={'Login'} />
          </ListItem>
        </Link>
      </List> }
    </div>
  );

  return (
    <div>
        <Drawer anchor={'right'} open={open} onClose={() => toggleDrawer('right', false)}>
            {list('right')}
        </Drawer>
    </div>
  );
}