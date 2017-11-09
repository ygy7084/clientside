import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import AccountMenuItem from './components/AccountMenuItem';
import './styles.css';

const drawerWidth = 240;
const styles = theme => ({
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  flex: {
    flex: 1
  }
});

const Bar = (props) => {
  const { classes } = props;
  return (
    <AppBar className={classes.appBar} color="primary">
      <Toolbar>
        <IconButton
          className={classes.navIconHide}
          color="contrast"
          aria-label="open drawer"
          onClick={props.toggleMenu}
        >
          <MenuIcon />
        </IconButton>
        <Typography className={classes.flex} type="title" color="inherit">
          { props.title }
        </Typography>
        <AccountMenuItem user={props.user} />
      </Toolbar>
    </AppBar>
  );
};
export default withStyles(styles)(Bar);
