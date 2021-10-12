import React from "react";

const DEFAULT_IMAGE = '/default-profile-image.jpg'

const ParticipantGalleryItem = ({ id, content={}, selectProfile }) => {
  const profileImage = content.image?.imageSrc || DEFAULT_IMAGE

  return (
    <>
      <button className="participant" onClick={selectProfile} aria-label="Open profile">
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
    </>
  );
};

ParticipantGalleryItem.defaultProps = {
  content: {},
  classes: "",
  onSave: () => { console.log('implement a function to save changes') }
}

export default ParticipantGalleryItem;
