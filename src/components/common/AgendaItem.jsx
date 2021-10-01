import React from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
const DEFAULT_IMAGE = '/default-profile-image.jpg'

const SpeakerThumbnail = ({ speaker, speakerName, selectSpeaker }) => {
  const handleClick = () => {
    selectSpeaker(speakerName)
  }

  const profileImage = speaker?.image?.imageSrc || DEFAULT_IMAGE

  if (speaker) {
    return (
      <button className="participant-thumbnail" onClick={handleClick} aria-label="Open profile">
        <div className="participant-image">
          <img src={profileImage} alt={speaker.name}/>
        </div>
        <div className="participant-name pretty-link">
          {speaker.name}
        </div>
      </button>
    )
  } else {
    return (
      <div className="participant-thumbnail">
        <div className="participant-image">
          <img src={profileImage} alt={speakerName}/>
        </div>
        <div className="participant-name">
          {speakerName}
        </div>
      </div>
    )
  }
}

const AgendaItem = ({ id, content={}, selectSpeaker, speakersArr }) => {
  const timeString = content.startTime && content.endTime ? `${content.startTime} - ${content.endTime}` : `${content.startTime}`;
  const speakerList = content.speakers ? content.speakers.split(',').map(str => str.trim()) : []
  const moderatorList = content.moderator ? content.moderator.split(',').map(str => str.trim()) : []
  return (
    <div className="mb-2">
      <Accordion square variant="outlined">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div className="display-block">
            <h4 className="mt-1 mb-1">{content.title}</h4>
            <p className="text-small mb-1">{timeString}</p>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="display-block">
            <p>{content.description}</p>
            {Boolean(speakerList.length) &&
              <div className="mb-1">
                <p className="text-small text-bold">{`Speakers:`}</p>
                {speakerList.map(speakerName => {
                  const speaker = speakersArr.find(s => s.name === speakerName)
                  return (
                    <SpeakerThumbnail
                      speaker={speaker}
                      speakerName={speakerName}
                      selectSpeaker={selectSpeaker}
                    />
                  )
                })}
              </div>
            }

            {Boolean(moderatorList.length) &&
              <div className="mb-1">
                <p className="text-small text-bold">{`Moderator:`}</p>
                {moderatorList.map(speakerName => {
                  const speaker = speakersArr.find(s => s.name === speakerName)
                  return (
                    <SpeakerThumbnail
                      speaker={speaker}
                      speakerName={speakerName}
                      selectSpeaker={selectSpeaker}
                    />
                  )
                })}
              </div>
            }
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

AgendaItem.defaultProps = {
  content: {},
  classes: "",
  onSave: () => { console.log('implement a function to save changes') }
}

export default AgendaItem;
