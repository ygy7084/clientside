import React from 'react';
import Button from 'material-ui/Button';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import SaveIcon from 'material-ui-icons/Save';
import RemoveIcon from 'material-ui-icons/Delete';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    width: 36,
    height: 36
  },
});
function ControlPanel(
  {
    classes, handleClickControls, mode, cannotSave, noRemove
  }) {
  return (
    <div>
      <Button
        fab
        color="primary"
        aria-label="arrowBack"
        className={classes.button}
        onClick={() => handleClickControls('goBack')}
      >
        <ArrowBackIcon />
      </Button>
      <Button
        fab
        color={cannotSave ? 'contrast' : 'primary'}
        disabled={cannotSave}
        aria-label="save"
        className={classes.button}
        onClick={mode === 'create' ?
          () => handleClickControls('createOne') : () => handleClickControls('modifyOne')}
      >
        <SaveIcon />
      </Button>
      {
        noRemove ?
          null :
          <Button
            fab
            color="accent"
            aria-label="remove"
            className={classes.button}
            onClick={() => handleClickControls('removeOne')}
          >
            <RemoveIcon />
          </Button>
      }
    </div>
  );
}
export default withStyles(styles)(ControlPanel);
