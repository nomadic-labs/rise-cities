import React, {useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import EmailIcon from '@material-ui/icons/Email';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import TwitterIcon from '@material-ui/icons/Twitter';
import LanguageIcon from '@material-ui/icons/Language';

const DEFAULT_IMAGE = '/default-profile-image.jpg'

const ParticipantGalleryItem = ({ id, content={} }) => {
  const [ isOpen, setIsOpen ] = useState(false)
  const profileImage = content.image?.imageSrc || DEFAULT_IMAGE

  return (
    <>
      <button className="participant" onClick={() => setIsOpen(true)} aria-label="Open profile">
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
              <div className="p-4 pr-0">
                <img src={profileImage} alt={content.name} className="participant-image-lg" />
              </div>
            </Grid>
            <Grid item xs={12} sm={8} style={{ display: 'flex', 'align-items': 'flex-end'}}>
              <div className="p-4">
                <h3 className="font-size-h2 mb-1 mt-0">{content.name}</h3>
                <p className="participant-affiliate-organization">{content.role}</p>
                {
                  (content.email) &&
                  <div className="links mt-5 mb-0">
                    <a href={`mailto:${content.email}`} target="_blank" rel="noopener noreferrer" className="pretty-link">
                      <div className="display-flex align-center text-normal text-small">
                        <EmailIcon /><span className="ml-2">{content.email}</span>
                      </div>
                    </a>
                  </div>
                }
                {
                  (content.website) &&
                  <div className="links mt-5 mb-0">
                    <a href={`mailto:${content.website}`} target="_blank" rel="noopener noreferrer" className="pretty-link">
                      <div className="display-flex align-center text-normal text-small">
                        <LanguageIcon /><span className="ml-2">{content.website}</span>
                      </div>
                    </a>
                  </div>
                }
                {
                  (content.twitter) &&
                  <div className="links mt-5 mb-0">
                    <a href={`mailto:${content.twitter}`} target="_blank" rel="noopener noreferrer" className="pretty-link">
                      <div className="display-flex align-center text-normal text-small">
                        <TwitterIcon /><span className="ml-2">{content.twitter}</span>
                      </div>
                    </a>
                  </div>
                }
                {
                  (content.linkedIn) &&
                  <div className="links mt-5 mb-0">
                    <a href={`mailto:${content.linkedIn}`} target="_blank" rel="noopener noreferrer" className="pretty-link">
                      <div className="display-flex align-center text-normal text-small">
                        <LinkedInIcon /><span className="ml-2">{content.linkedIn}</span>
                      </div>
                    </a>
                  </div>
                }
              </div>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <div className="p-4 pt-0">
                <p>{content.bio}</p>
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
