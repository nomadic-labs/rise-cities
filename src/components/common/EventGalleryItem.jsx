import React, {useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import TwitterIcon from '@material-ui/icons/Twitter';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import EmailIcon from '@material-ui/icons/Email';
import ensureAbsoluteUrl from '../../utils/ensureAbsoluteUrl';

const DEFAULT_IMAGE = '/default-profile-image.jpg'

const EventGalleryItem = ({ id, content={} }) => {
  const [ isOpen, setIsOpen ] = useState(false)
  const eventImage = content.image?.imageSrc || DEFAULT_IMAGE

  return (
    <div className="event">
      <Grid container spacing={4}>
        <Grid item xs={12} sm={3} md={3}>
          <div className="text-secondary text-xs mb-2">{content.location}</div>
          <div className="text-bold text-uppercase">{content.date}</div>
        </Grid>

        <Grid item xs={4} sm={3} md={4}>
          <img src={eventImage} alt="" className="event-image" />
        </Grid>

        <Grid item xs={8} sm={6} md={5}>
          <h3 className="text-uppercase mt-0">
            { content.title }
          </h3>
          <p>{ content.description }</p>
          {
            content.url &&
            <a className="pretty-link" href={ ensureAbsoluteUrl(content.url) }>More info</a>
          }
        </Grid>
      </Grid>

    </div>
  );
};

EventGalleryItem.defaultProps = {
  content: {},
  classes: "",
  onSave: () => { console.log('implement a function to save changes') }
}

export default EventGalleryItem;
