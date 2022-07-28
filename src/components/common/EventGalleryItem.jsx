import React from "react";
import Grid from "@material-ui/core/Grid";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Hidden from "@material-ui/core/Hidden";
import ensureAbsoluteUrl from '../../utils/ensureAbsoluteUrl';
import LazyLoad from 'react-lazyload';
import { DateTime } from 'luxon';

import upcomingIcon from '../../assets/images/icons/upcoming-icon.svg';
import pastIcon from '../../assets/images/icons/past-icon.svg';

const DEFAULT_IMAGE = '/default-profile-image.jpg'

const formatDate = (str) => {
  return DateTime.fromISO(str).toLocaleString({
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatTime = (str, zone) => {
  return DateTime.fromISO(str).setZone(zone).toLocaleString(DateTime.TIME_SIMPLE);
};

const Period = ({ period }) => {

  const icon = period === 'past' ? pastIcon : upcomingIcon;

  return (
    <div className="display-flex align-center">
      <img src={icon} alt={period} />
      <span className="text-uppercase text-xs ml-2">{period}</span>
    </div>
  );
  
};

const EventGalleryItem = ({ id, content={} }) => {
  const eventImage = content.image?.imageSrc || DEFAULT_IMAGE


  // the default "fallback" value is a string which is entered
  // directly by the user
  let dateString = content.date;

  // we have added a time picker to the event editor so that 
  // the user can choose semantic dates, and we will format them
  if (content.startDate && content.endDate) {
    const start = DateTime.fromISO(content.startDate);
    const end = DateTime.fromISO(content.endDate);

    if (start.year === end.year) {
      const month1 = start.toLocaleString({ month: 'long' });
      const month2 = end.toLocaleString({ month: 'long' });
      const day1 = start.toLocaleString({ day: 'numeric' });
      const day2 = end.toLocaleString({ day: 'numeric' });
      const year = start.toLocaleString({ year: 'numeric' });

      if (start.month === end.month) {
        dateString = `${month1} ${day1} – ${day2}, ${year}`;
      } else {
        dateString = `${month1} ${day1} – ${month2} ${day2}, ${year}`;
      }
    } else {
      dateString = `${formatDate(content.startDate)} – ${formatDate(content.endDate)}`;
    }
  } else if (content.startDate) {
    dateString = formatDate(content.startDate);
  }

  let timeString = null;
  const zone = content.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (content.startTime && content.endTime) {
    timeString = `${formatTime(content.startTime, zone)} – ${formatTime(content.endTime, zone)}`;
  } else if (content.startTime) {
    timeString = formatTime(content.startTime, zone);
  }

  const { period } = content;

  return (
    <div className="event pb-5">
      <Hidden xsDown>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={3} md={3}>
            <div className="mb-5">
              <Period period={period} />
            </div>
            <div className="text-secondary text-xs mb-2">{content.location}</div>
            <div className="text-bold text-uppercase">{dateString}</div>
            { timeString && <div className="text-xs text-uppercase text-muted">{timeString}</div> }
          </Grid>

          <Grid item xs={4} sm={3} md={4}>
            <LazyLoad offset={200}>
              <img src={eventImage} alt="" className="event-image" />
            </LazyLoad>
          </Grid>

          <Grid item xs={8} sm={6} md={5}>
            <h3 className="text-uppercase mt-0">
              { content.title }
            </h3>
            <p className="pre-wrap">{ content.description }</p>
            {
              content.url &&
              <a className="pretty-link" href={ ensureAbsoluteUrl(content.url) } target="_blank" rel="noopener noreferrer">More info <span><ArrowForwardIcon style={{ fontSize: 20 }} /></span></a>
            }
          </Grid>
        </Grid>
        </Hidden>
        <Hidden smUp>
          <a href={ ensureAbsoluteUrl(content.url) } className="event-link">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <LazyLoad offset={200}>
                  <img src={eventImage} alt="" className="event-image" style={{ maxHeight: '220px', objectFit: 'cover' }} />
                </LazyLoad>
              </Grid>

              <Grid item xs={12}>
                <div className="text-secondary text-xs mb-2">{content.location}</div>
                <div className="text-bold text-dark">{dateString}</div>
                { timeString && <div className="text-xs text-uppercase text-muted">{timeString}</div> }
                <h3 className="text-uppercase mt-2 text-dark">
                  { content.title }
                </h3>
              </Grid>
            </Grid>
          </a>
        </Hidden>
    </div>
  );
};

EventGalleryItem.defaultProps = {
  content: {},
  classes: "",
  onSave: () => { console.log('implement a function to save changes') }
}

export default EventGalleryItem;
