import React from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Dialog, { DialogContent, DialogActions } from 'material-ui/Dialog';

function FullSizeImage({ image, handleRequestClose, show }) {
  return (
    <Dialog
      open={show}
      onRequestClose={handleRequestClose}
    >
      <DialogContent>
        <img src={image} alt="FullSize" />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRequestClose} color="primary">
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default FullSizeImage;
