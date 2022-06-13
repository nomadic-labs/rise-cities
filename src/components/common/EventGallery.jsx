import React from "react";
import Button from "@material-ui/core/Button"
import { connect } from "react-redux";

import EventGalleryItem from "./EventGalleryItem"
import EventModal from "./EventModal";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {EditablesContext, EditorWrapper, theme} from "react-easy-editables";

import groupBy from 'lodash/groupBy';
import { DateTime } from 'luxon';

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

const Event = ({ event, isEditingPage, startEditing }) => (
  <div>
    {
      isEditingPage &&
      <ThemeProvider theme={muiTheme}>
        <EditorWrapper
          theme={this.context.theme}
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

class EventGallery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      editingEvent: null,
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
    const { showModal, editingEvent } = this.state;
    const events = Object.keys(this.props.content).reverse().map(key => this.props.content[key])

    const today = DateTime.now();

    const groupedEvents = groupBy(events, (event) => {

      if (event.endDate && event.startDate) {
        return DateTime.fromISO(event.endDate) < today ? 'past' : 'upcoming';
      } else if (event.startDate) {
        return DateTime.fromISO(event.startDate) < today ? 'past' : 'upcoming';
      }

      return 'upcoming';
    });

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
        <h3 className="text-black">
          Upcoming Events
        </h3>
        {groupedEvents['upcoming'].map((event) => {
          return (
            <Event key={event.id}
              event={event}
              startEditing={() => this.setState({ showModal: true, editingEvent: event })}
              isEditingPage={this.props.isEditingPage}
            />
          );
        })}
        <h3 className="text-black">
          Past Events
        </h3>
        {groupedEvents['past'].map((event) => {
          return (
            <Event key={event.id}
              event={event}
              startEditing={() => this.setState({ showModal: true, editingEvent: event })}
              isEditingPage={this.props.isEditingPage}
            />
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

