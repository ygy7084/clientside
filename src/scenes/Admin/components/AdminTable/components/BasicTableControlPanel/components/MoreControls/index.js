import React from 'react';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  listFull: {
    width: 'auto',
  },
});
const BasicTableControlPanel = (props) => {
  const { classes } = props;
  return (
    <div>
      <Drawer
        anchor="top"
        open={props.open}
        onRequestClose={props.toggle}
      >
        <div
          tabIndex={0}
          role="button"
          onClick={props.toggle}
          onKeyDown={props.toggle}
        >
          <div className={classes.listFull}>
            <List>
              <ListItem button>
                <ListItemText primary="메뉴" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="메뉴" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="메뉴" />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem button>
                <ListItemText primary="닫기" />
              </ListItem>
            </List>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
export default withStyles(styles)(BasicTableControlPanel);