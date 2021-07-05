import React, {useState} from "react";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import image from '../../assets/images/contact.jpg'

const buttonStyles = {
  position: 'fixed',
  bottom: '30px',
  border: 'none',
}

const ContactPopup = () => {
  const [ isOpen, setIsOpen ] = useState(false)

  return (
    <Container style={{ display: 'flex', 'justifyContent': 'flex-end' }}>
      <button
        id="contact-button"
        className="bg-gradient"
        onClick={() => setIsOpen(true)}
        aria-label="Open contact page"
        style={buttonStyles}>
        <MailOutlineIcon />
      </button>
      <Dialog
        maxWidth="xs"
        fullWidth
        bottom={50}
        open={isOpen}
        PaperProps={{ square: true }}
        onClose={() => setIsOpen(false)}
      >
        <img src={image} alt="" style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}/>
        <DialogContent className="contact-modal" style={{ paddingBottom: '30px' }}>
          <p className="mt-4 mb-4 font-size-h3">Want to know more about RISE cities?</p>
          <a href="mailto:risecities@bmw-foundation.org" className="btn bg-gradient text-xs">Get in touch with us</a>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ContactPopup;
