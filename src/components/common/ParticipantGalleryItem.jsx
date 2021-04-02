import React, {useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import TwitterIcon from '@material-ui/icons/Twitter';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import EmailIcon from '@material-ui/icons/Email';
import ensureAbsoluteUrl from '../../utils/ensureAbsoluteUrl';

const DEFAULT_IMAGE = '/default-profile-image.jpg'

const ParticipantGalleryItem = ({ id, content={} }) => {
  const [ isOpen, setIsOpen ] = useState(false)
  const profileImage = content.image?.imageSrc || DEFAULT_IMAGE

  return (
    <>
      <button className="participant" onClick={() => setIsOpen(true)}>
        <div className="participant-image">
          <img src={profileImage} alt={content.name}/>
        </div>
        <div className="participant-name pretty-link">
          {content.name}
        </div>
        <div className="participant-affiliate-organization">
          {content.role}
        </div>
      </button>
      <Dialog maxWidth="sm" fullWidth open={isOpen} PaperProps={{ square: true }} onClose={() => setIsOpen(false)}>
        <DialogContent className="participant-modal">
          <Grid container>
            <Grid item xs={12} sm={4}>
              <img src={profileImage} alt={content.name} className="participant-image-lg" />
            </Grid>
            <Grid item xs={12} sm={8}>
              <div className="p-4">
                <h2 className="font-size-h2">{content.name}</h2>
                <div className="participant-affiliate-organization">{content.role}</div>
                <div>{content.bio}</div>
                {
                  (content.email) &&
                  <div className="links">
                    <a href={`mailto:${content.email}`} target="_blank" rel="noopener noreferrer">
                      <EmailIcon />
                    </a>
                  </div>
                }
              </div>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

ParticipantGalleryItem.defaultProps = {
  content: {},
  classes: "",
  onSave: () => { console.log('implement a function to save changes') }
}

export default ParticipantGalleryItem;
