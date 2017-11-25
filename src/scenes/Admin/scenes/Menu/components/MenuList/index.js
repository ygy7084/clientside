import React from 'react';
import { withStyles } from 'material-ui/styles';
import List, {
  ListItem,
  ListItemText,
} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

const styles = {
  list: {
    marginBottom: '50px',
  },
  bigAvatar: {
    width: 60,
    height: 60,
  },
};
const MenuList = ({ list, classes, onSortEnd }) => {
  const SortableItem = SortableElement(({ item }) => (
    <ListItem
      key={item.name}
      button
    >
      <Avatar
        alt="사진"
        src={item.pictures ? item.pictures[0] : null}
        className={classes.bigAvatar}
      />
      <ListItemText
        primary={item.name}
        secondary={item.subDescription}
      />
    </ListItem>
  ));
  const SortableList = SortableContainer(({ items }) => {
    return (
      <List classes={{ root: classes.list }}>
        {items.map((item, index) => (
          <SortableItem key={item._id} index={index} item={item} />
        ))}
      </List>
    );
  });
  return (
    <SortableList onSortEnd={onSortEnd} items={list} />
  );
};
export default withStyles(styles)(MenuList);
