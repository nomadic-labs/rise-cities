import React from "react";
import ensureAbsoluteUrl from '../../utils/ensureAbsoluteUrl';

const DEFAULT_IMAGE = '/default-partner-image.jpg'

const OptionalLink = ({ url, children }) => {

  return url ? (
    <a className="partner-link pretty-link" 
      href={ensureAbsoluteUrl(url)} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <div className="partner-link pretty-link">
      {children}
    </div>
  )
};

const PartnerGalleryItem = ({ id, content={} }) => {
  const partnerImage = content.image?.imageSrc || DEFAULT_IMAGE

  const { url } = content;
  return (
    <div className="partner">
      <OptionalLink url={url}>
        <div className="partner-image">
          <img src={partnerImage} alt={content.name}/>
        </div>
      </OptionalLink>
    </div>
  );
};

PartnerGalleryItem.defaultProps = {
  content: {},
  classes: "",
  onSave: () => { console.log('implement a function to save changes') }
}

export default PartnerGalleryItem;
