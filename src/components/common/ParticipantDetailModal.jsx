import React, {useState, useEffect} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import EmailIcon from '@material-ui/icons/Email';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import TwitterIcon from '@material-ui/icons/Twitter';
import LanguageIcon from '@material-ui/icons/Language';

const DEFAULT_IMAGE = '/default-profile-image.jpg'

const ParticipantDetailModal = ({ profile, closeModal }) => {
  if (!profile) {
    return null
  }

  const profileImage = profile.image?.imageSrc || DEFAULT_IMAGE

  return (
    <>
      <Dialog maxWidth="sm" fullWidth open={Boolean(profile)} PaperProps={{ square: true }} onClose={closeModal}>
        <DialogContent className="participant-modal">
          <Grid container>
            <Grid item xs={12} sm={4}>
              <div className="p-4">
                <img src={profileImage} alt={profile.name} className="participant-image-lg" />
              </div>
            </Grid>
            <Grid item xs={12} sm={8} style={{ display: 'flex', alignItems: 'flex-end'}}>
              <div className="p-4">
                <h3 className="font-size-h2 mb-1 mt-0">{profile.name}</h3>
                <p className="participant-affiliate-organization">{profile.role}</p>
              </div>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <div className="p-4 pt-0">
                <p>{profile.bio}</p>
              </div>
              <div className="p-4 pt-0">
                {
                  (profile.email) &&
                  <div className="links mb-0">
                    <a href={`mailto:${profile.email}`} target="_blank" rel="noopener noreferrer" className="pretty-link">
                      <div className="display-flex align-center text-normal text-small">
                        <EmailIcon /><span className="ml-2">{profile.email}</span>
                      </div>
                    </a>
                  </div>
                }
                {
                  (profile.website) &&
                  <div className="links mb-0">
                    <a href={`mailto:${profile.website}`} target="_blank" rel="noopener noreferrer" className="pretty-link">
                      <div className="display-flex align-center text-normal text-small">
                        <LanguageIcon /><span className="ml-2">{profile.website}</span>
                      </div>
                    </a>
                  </div>
                }
                {
                  (profile.twitter) &&
                  <div className="links mb-0">
                    <a href={`mailto:${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="pretty-link">
                      <div className="display-flex align-center text-normal text-small">
                        <TwitterIcon /><span className="ml-2">{profile.twitter}</span>
                      </div>
                    </a>
                  </div>
                }
                {
                  (profile.linkedIn) &&
                  <div className="links mb-0">
                    <a href={`mailto:${profile.linkedIn}`} target="_blank" rel="noopener noreferrer" className="pretty-link">
                      <div className="display-flex align-center text-normal text-small">
                        <LinkedInIcon /><span className="ml-2">{profile.linkedIn}</span>
                      </div>
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

ParticipantDetailModal.defaultProps = {
  profile: null,
  classes: "",
  onSave: () => { console.log('implement a function to save changes') }
}

export default ParticipantDetailModal;
