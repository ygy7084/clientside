import React from 'react';
import { withStyles } from 'material-ui/styles';
import Bar from './components/Bar';
import Menu from './components/Menu';

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  content: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    padding: theme.spacing.unit * 3,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },
});
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
    };
    this.handleToggleMenu = this.handleToggleMenu.bind(this);
  }
  handleToggleMenu() {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  }
  render() {
    const { classes, selectedMenuItem } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <Bar
            user={this.props.user}
            toggleMenu={this.handleToggleMenu}
            title={this.props.selectedMenuItem.name}
          />
          <Menu
            open={this.state.menuOpen}
            toggleMenu={this.handleToggleMenu}
            title={this.props.appTitle}
            menuItems={this.props.menuItems}
            selectedMenuItem={selectedMenuItem}
            onMenuClick={this.props.onMenuClick}
          />
          <main className={classes.content}>
            { this.props.children }
          </main>
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(Home);
