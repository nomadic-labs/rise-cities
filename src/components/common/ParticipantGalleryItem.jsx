import React, {useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import EmailIcon from '@material-ui/icons/Email';
import LazyLoad from 'react-lazyload';

const DEFAULT_IMAGE = '/default-profile-image.jpg'

const ParticipantGalleryItem = ({ id, content={} }) => {
  const [ isOpen, setIsOpen ] = useState(false)
  const profileImage = content.image?.imageSrc || DEFAULT_IMAGE

  return (
    <LazyLoad offset={200}>
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
                <h3 className="font-size-h2 mb-1 mt-0">{content.name}</h3>
                <p className="participant-affiliate-organization">{content.role}</p>
                <p>{content.bio}</p>
                {
                  (content.email) &&
                  <div className="links mt-5 mb-5">
                    <a href={`mailto:${content.email}`} target="_blank" rel="noopener noreferrer" className="pretty-link">
                      <div className="display-flex align-center text-normal text-small">
                        <EmailIcon /><span className="ml-2">{content.email}</span>
                      </div>
                    </a>
                  </div>
                }
              </div>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </LazyLoad>
  );
};

ParticipantGalleryItem.defaultProps = {
  content: {},
  classes: "",
  onSave: () => { console.log('implement a function to save changes') }
}

export default ParticipantGalleryItem;
