import React from "react";
import Button from "@material-ui/core/Button"
import { connect } from "react-redux";

import EventGalleryItem from "./EventGalleryItem"
import EventModal from "./EventModal";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {EditablesContext, EditorWrapper, theme} from "react-easy-editables";

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

  onDeleteItem = itemId => () => {
    let newContent = { ...this.props.content }
    newContent[itemId] = null

    this.props.onSave(newContent)
  }

  render() {
    const { showModal, editingEvent } = this.state;
    const events = Object.keys(this.props.content).map(key => this.props.content[key])
    const orderedEvents = events.sort((a,b) => a.name.localeCompare(b.name))

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
        {orderedEvents.map((event,index) => {
          return (
            <div
              key={event.id}>
              {
                this.props.isEditingPage &&
                <ThemeProvider theme={muiTheme}>
                  <EditorWrapper
                    theme={this.context.theme}
                    startEditing={() => this.setState({ showModal: true, editingEvent: event })}
                  >
                    <EventGalleryItem content={event} id={event.id} />
                  </EditorWrapper>
                </ThemeProvider>
              }
              {
                !this.props.isEditingPage &&
                <EventGalleryItem content={event} id={event.id} />
              }
            </div>
          )
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

