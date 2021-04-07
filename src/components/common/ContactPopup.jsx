import React, {useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LazyLoad from 'react-lazyload';
import image from '../../assets/images/contact.jpg'

const buttonStyles = {
  position: 'fixed',
  right: '30px',
  bottom: '30px',
  border: 'none',
}

const ContactPopup = () => {
  const [ isOpen, setIsOpen ] = useState(false)

  return (
    <>
      <button
        id="contact-button"
        className="btn btn-gradient"
        onClick={() => setIsOpen(true)}
        aria-label="Open contact page"
        style={buttonStyles}>
        <MailOutlineIcon />
      </button>
      <Dialog maxWidth="xs" fullWidth open={isOpen} PaperProps={{ square: true }} onClose={() => setIsOpen(false)}>
        <img src={image} alt="" style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}/>
        <DialogContent className="contact-modal" style={{ paddingBottom: '30px' }}>
          <p className="mt-4 mb-4 font-size-h3">Want to know more about RISE cities?</p>
          <a href="mailto:risecities@bmwfoundation.org" className="btn bg-gradient text-xs">Get in touch with us</a>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactPopup;
