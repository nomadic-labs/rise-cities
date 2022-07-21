import React from "react";
import Button from "@material-ui/core/Button"
import { connect } from "react-redux";

import EventGalleryItem from "./EventGalleryItem"
import EventModal from "./EventModal";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {EditablesContext, EditorWrapper, theme} from "react-easy-editables";

import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import { DateTime } from 'luxon';
import Filter from './Filter';

import upcomingIcon from '../../assets/images/icons/upcoming-icon.svg';
import pastIcon from '../../assets/images/icons/past-icon.svg';

const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: theme.primaryColor,
    }
  },
  typography: {
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize
  }
})

const mapStateToProps = state => {
  return {
    isEditingPage: state.adminTools.isEditingPage,
  };
};

const Event = ({ event, isEditingPage, startEditing, theme }) => (
  <div>
    {
      isEditingPage &&
      <ThemeProvider theme={muiTheme}>
        <EditorWrapper
          theme={theme}
          startEditing={startEditing}
        >
          <EventGalleryItem content={event} id={event.id} />
        </EditorWrapper>
      </ThemeProvider>
    }
    {
      !isEditingPage &&
      <EventGalleryItem content={event} id={event.id} />
    }
  </div>
);

const dateCompare = (a, b, reverse) => {
  const aStart = a.startDate ? DateTime.fromISO(a.startDate).valueOf() : 0;
  const bStart = b.startDate ? DateTime.fromISO(b.startDate).valueOf() : 0;
  return (bStart - aStart) * (reverse ? -1 : 1);
};

const FILTER_OPTS = [
  {
    value: 'Upcoming',
    icon: upcomingIcon,
  },
  {
    value: 'Past',
    icon: pastIcon,
  },
];

class EventGallery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      editingEvent: null,
      filter: 'Upcoming',
    }
  }

  onSaveItem = (itemId, itemContent) => {
    const newContent = {
      ...this.props.content,
      [itemId]: itemContent
    }

    this.props.onSave(newContent)
  }

  onDeleteItem = itemId => {
    let newContent = { ...this.props.content }
    delete newContent[itemId]

    this.props.onSave(newContent)
  }

  render() {
    const { showModal, editingEvent, filter } = this.state;
    const events = Object.keys(this.props.content).reverse().map(key => this.props.content[key])

    const today = DateTime.now();

    const eventsWithPeriod = map(events, (event) => {
      let period = 'upcoming';
      if (event.endDate && event.startDate) {
        period = DateTime.fromISO(event.endDate) < today ? 'past' : 'upcoming';
      } else {
        period = DateTime.fromISO(event.startDate) < today ? 'past' : 'upcoming';
      }

      return { ...event, period };
    });

    const groupedEvents = groupBy(eventsWithPeriod, 'period');

    let { past, upcoming } = groupedEvents;
    past = past || [];
    upcoming = upcoming || [];

    past.sort((a, b) => dateCompare(a, b, false));
    upcoming.sort((a, b) => dateCompare(a, b, true));

    // when editing, show all events; otherwise, it's filtered
    const eventsToShow = this.props.isEditingPage ? 
      [ ...past, ...upcoming ] : 
      filter === 'Past' ? past : upcoming;

    return (
      <div id="event-gallery" className={`collection width-100 mt-2 ${this.props.classes}`}>
        {
          this.props.isEditingPage &&
          <div className="row mt-6 mb-4">
            <div className="col-12">
              <Button
                onClick={() => this.setState({ showModal: true })}
                color="default"
                variant="contained">
                Add event
              </Button>
            </div>
          </div>
        }

        { !this.props.isEditingPage &&
          <div className="mt-6 mb-6" id="event-toggler">
            <Filter options={FILTER_OPTS}
              value={filter}
              onChange={(filter) => this.setState({ filter })}
            />
          </div>
        }

        {eventsToShow.map((event) => {
          return (
          <div className="delay-in">
            <Event key={event.id}
              event={event}
              startEditing={() => this.setState({ showModal: true, editingEvent: event })}
              isEditingPage={this.props.isEditingPage}
              theme={this.context.theme}
            />
          </div>
          );
        })}

        <EventModal
          event={editingEvent}
          onSaveItem={this.onSaveItem}
          showModal={showModal}
          closeModal={() => this.setState({ showModal: false, editingEvent: null })}
          onDeleteItem={this.onDeleteItem}
        />
      </div>
    );
  }
}

EventGallery.contextType = EditablesContext;


EventGallery.defaultProps = {
  content: {},
  classes: "",
  onSave: () => { console.log('Implement a function to save changes') }
}

export default connect(mapStateToProps, null)(EventGallery)

