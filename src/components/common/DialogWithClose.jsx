import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const DialogWithClose = (props) => {

  const { children, onClose, ...rest } = props;

  return (
    <Dialog {...rest}>
      <DialogTitle disableTypography className="display-flex justify-right">
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      { children }
    </Dialog>
  );
};

export default DialogWithClose;