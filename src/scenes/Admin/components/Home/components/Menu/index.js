import React from 'react';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Hidden from 'material-ui/Hidden';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';

const drawerWidth = 240;
const styles = theme => ({
  drawerHeader: {
    ...theme.mixins.toolbar,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerPaper: {
    width: 250,
    height: '100% !important',
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      position: 'relative',
      height: '100%',
    },
  },
  docked: {
    height: '100%',
  },
  selected: {
    background: 'lightgrey',
  },
});
function Menu({ classes, theme, ...props }) {
  const drawer = (
    <div style={{ height: '100%' }}>
      <div className={classes.drawerHeader} >
        <Typography type="title" color="inherit">
          { props.title }
        </Typography>
      </div>
      <Divider />
      <List>
        {
          props.menuItems.map(Item => (
            <ListItem
              key={Item.name}
              button
              className={props.selectedMenuItem === Item ?
                classes.selected : undefined
              }
              onClick={() => props.onMenuClick(Item.path)}
            >
              <ListItemIcon>
                <Item.icon />
              </ListItemIcon>
              <ListItemText primary={Item.name} />
            </ListItem>
          ))
        }
      </List>
    </div>
  );
  return (
    <div>
      <Hidden mdUp>
        <Drawer
          type="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={props.open}
          classes={{
            paper: classes.drawerPaper,
          }}
          onRequestClose={props.toggleMenu}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden mdDown implementation="css">
        <Drawer
          type="permanent"
          open
          classes={{
            paper: classes.drawerPaper,
            docked: classes.docked,
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
    </div>
  );
}
export default withStyles(styles, { withTheme: true })(Menu);
