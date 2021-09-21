import React, {useState} from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const AgendaItem = ({ id, content={} }) => {
  console.log({content})

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
            <p className="text-small mb-1">{`${content.startTime} - ${content.endTime}`}</p>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="display-block">
            <p>{content.description}</p>
            <p className="text-small mb-1 text-bold">{`Speakers: ${content.speakers}`}</p>
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
