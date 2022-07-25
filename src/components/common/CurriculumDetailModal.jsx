import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import LanguageIcon from '@material-ui/icons/Language';

const DEFAULT_IMAGE = '/default-profile-image.jpg'

const CurriculumDetailModal = (props) => {
  const { module, closeModal } = props;

  if (!module) return null;

  const image = module.image ? JSON.parse(module.image) : {};

  const { title, summary, url, speaker } = module;

  return (
    <>
      <Dialog maxWidth="sm" fullWidth open={Boolean(module)} PaperProps={{ square: true }} onClose={closeModal}>
        <DialogContent className="tandem-info">
          <Grid container>
            <Grid item xs={12}>
              <div className="tandem-img">
                <img src={image.imageSrc || DEFAULT_IMAGE} alt={title} />
              </div>
            </Grid>
            <Grid item xs={12} style={{ display: 'flex', alignItems: 'flex-end'}}>
              <div className="p-4">
                <span className="font-size-h2 mb-1 mt-0">{title}</span>
              </div>
            </Grid>
            <Grid item xs={12} style={{ display: 'flex', alignItems: 'flex-end'}}>
              <div className="p-4 text-bold text-small">
                <span>{speaker}</span>
              </div>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <div className="p-4 pt-0">
                <p>{summary}</p>
              </div>
              <div className="p-4 pt-0">
                {
                  url &&
                  <div className="links mb-0">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="pretty-link">
                      <div className="display-flex align-center text-normal text-small">
                        <LanguageIcon /><span className="ml-2">{url}</span>
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

export default CurriculumDetailModal;
