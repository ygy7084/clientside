import React from 'react';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import MoreIcon from 'material-ui-icons/MoreHoriz';
import CheckIcon from 'material-ui-icons/Done';
import { withStyles } from 'material-ui/styles';
import MoreControls from './components/MoreControls';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    width: 36,
    height: 36
  },
});
class BasicTableControlPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moreControlsOpen: false,
    };
    this.toggleMoreControls = this.toggleMoreControls.bind(this);
  }
  toggleMoreControls() {
    this.setState({ moreControlsOpen: !this.state.moreControlsOpen });
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button
          disabled={this.props.selectionOn}
          fab
          color="primary"
          aria-label="add"
          className={classes.button}
          onClick={
            () => this.props.handleClickControls('toCreatePage')
          }
        >
          <AddIcon />
        </Button>
        <Button
          fab
          color={this.props.selectionOn ? 'accent' : 'primary'}
          aria-label="check"
          className={classes.button}
          onClick={
            () => this.props.handleClickControls('allowSelection')
          }
        >
          <CheckIcon />
        </Button>
      </div>
    );
    // 기타 기능 버튼
    // return (
    //   <div>
    //     <Button
    //       disabled={this.props.selectionOn}
    //       fab
    //       color="primary"
    //       aria-label="add"
    //       className={classes.button}
    //     >
    //       <AddIcon />
    //     </Button>
    //     <Button
    //       fab
    //       color={this.props.selectionOn ? 'accent' : 'primary'}
    //       aria-label="check"
    //       className={classes.button}
    //       onClick={
    //         () => this.props.handleClickControls('allowSelection')
    //       }
    //     >
    //       <CheckIcon />
    //     </Button>
    //     <Button
    //       disabled={this.props.selectionOn}
    //       fab
    //       color="primary"
    //       aria-label="more"
    //       className={classes.button}
    //       onClick={this.toggleMoreControls}
    //     >
    //       <MoreIcon />
    //     </Button>
    //     <MoreControls
    //       open={this.state.moreControlsOpen}
    //       toggle={this.toggleMoreControls}
    //     />
    //   </div>
    // );
  }
}
export default withStyles(styles)(BasicTableControlPanel);
