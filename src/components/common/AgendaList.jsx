import React from "react";
import Button from "@material-ui/core/Button"
import { connect } from "react-redux";

import AgendaItem from "./AgendaItem"
import AgendaModal from "./AgendaModal";
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

class AgendaList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      editingAgendaItem: null,
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

    console.log({newContent})

    this.props.onSave(newContent)
  }

  render() {
    const { showModal, editingAgendaItem } = this.state;
    let agendaItems = Object.keys(this.props.content).map(key => this.props.content[key])
    agendaItems.sort((item1, item2) => parseInt(item1.startTime) - parseInt(item2.startTime))

    return (
      <div id="agenda-list" className={`collection width-100 mt-2 ${this.props.classes}`}>
        {
          this.props.isEditingPage &&
          <div className="row mt-6 mb-4">
            <div className="col-12">
              <Button
                onClick={() => this.setState({ showModal: true })}
                color="default"
                variant="contained">
                Add agenda item
              </Button>
            </div>
          </div>
        }
        {agendaItems.map((agendaItem,index) => {
          return (
            <div
              className='pr-4'
              key={agendaItem.id}>
              {
                this.props.isEditingPage &&
                <ThemeProvider theme={muiTheme}>
                  <EditorWrapper
                    theme={this.context.theme}
                    startEditing={() => this.setState({ showModal: true, editingAgendaItem: agendaItem })}
                    isContentClickTarget={false}
                  >
                    <AgendaItem content={agendaItem} id={agendaItem.id} />
                  </EditorWrapper>
                </ThemeProvider>
              }
              {
                !this.props.isEditingPage &&
                <AgendaItem
                  content={agendaItem}
                  id={agendaItem.id}
                  selectSpeaker={this.props.selectSpeaker}
                  speakersArr={this.props.speakersArr}
                />
              }
            </div>
          )
        })}


        <AgendaModal
          agendaItem={editingAgendaItem}
          onSaveItem={this.onSaveItem}
          showModal={showModal}
          closeModal={() => this.setState({ showModal: false, editingAgendaItem: null })}
          onDeleteItem={this.onDeleteItem}
        />
      </div>
    );
  }
}

AgendaList.contextType = EditablesContext;


AgendaList.defaultProps = {
  content: {},
  classes: "",
  onSave: () => { console.log('Implement a function to save changes') }
}

export default connect(mapStateToProps, null)(AgendaList)

