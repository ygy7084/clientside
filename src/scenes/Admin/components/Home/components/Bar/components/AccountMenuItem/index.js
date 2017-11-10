import React from 'react';
import { findDOMNode } from 'react-dom';
import IconButton from 'material-ui/IconButton';
import AccountIcon from 'material-ui-icons/AccountBox';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import MenuItemPopOver from '../MenuItemPopOver';

class AccountMenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchor: null,
    };
    this.handleClickButton = this.handleClickButton.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }
  handleClickButton() {
    this.setState({
      open: true,
      anchor: findDOMNode(this.icon),
    });
  }
  handleRequestClose() {
    this.setState({
      open: false,
    });
  }
  render() {
    const { user, handleLogout } = this.props;
    return (
      <div>
        <IconButton
          ref={(icon) => { this.icon = icon; }}
          color="contrast"
          aria-label="Account"
          onClick={this.handleClickButton}
        >
          <AccountIcon />
        </IconButton>
        <MenuItemPopOver
          anchorEl={this.state.anchor}
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
        >
          <List>
            <ListItem>
              <ListItemText
                primary={
                  user[user.kind] ? user[user.kind].username : ''
                }
                secondary={
                  user[user.kind] ? user[user.kind].level : ''
                }
              />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="로그아웃" />
            </ListItem>
          </List>
        </MenuItemPopOver>
      </div>
    );
  }
}
export default AccountMenuItem;
