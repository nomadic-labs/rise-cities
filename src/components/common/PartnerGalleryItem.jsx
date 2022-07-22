import React from "react";
import ensureAbsoluteUrl from '../../utils/ensureAbsoluteUrl';

const DEFAULT_IMAGE = '/default-partner-image.jpg'

const PartnerGalleryItem = ({ id, content={} }) => {
  const partnerImage = content.image?.imageSrc || DEFAULT_IMAGE

  const { url } = content;
  const linkProps = url ? 
    { href: ensureAbsoluteUrl(url), target: '_blank', rel: 'noopener noreferrer' } :
    {};

  return (
    <div className="partner">
      <a className="partner-link pretty-link" {...linkProps}>
        <div className="partner-image">
          <img src={partnerImage} alt={content.name}/>
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
