import React from 'react';
import Popover from 'material-ui/Popover';

const MenuItemPopOver = props => (
  <Popover
    anchorEl={props.anchorEl}
    open={props.open}
    onRequestClose={props.onRequestClose}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
  >
    { props.children }
  </Popover>
);
export default MenuItemPopOver;
