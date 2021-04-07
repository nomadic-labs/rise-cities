import React from "react";
import ensureAbsoluteUrl from '../../utils/ensureAbsoluteUrl';
import LazyLoad from 'react-lazyload';

const DEFAULT_IMAGE = '/default-partner-image.jpg'

const PartnerGalleryItem = ({ id, content={} }) => {
  const partnerImage = content.image?.imageSrc || DEFAULT_IMAGE

  return (
    <div className="partner">
      <a className="partner-link pretty-link" href={ensureAbsoluteUrl(content.url)}>
        <div className="partner-image">
          <LazyLoad offset={200}>
          <img src={partnerImage} alt={content.name}/>
          </LazyLoad>
        </div>
      </a>
    </div>
  );
};

PartnerGalleryItem.defaultProps = {
  content: {},
  classes: "",
  onSave: () => { console.log('implement a function to save changes') }
}

export default PartnerGalleryItem;
