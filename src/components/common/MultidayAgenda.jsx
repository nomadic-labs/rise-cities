import React from "react";
import Button from "@material-ui/core/Button"
import { connect } from "react-redux";

import AgendaList from "./AgendaList"
import {EditablesContext, EditableText} from "react-easy-editables";

const mapStateToProps = state => {
  return {
    isEditingPage: state.adminTools.isEditingPage,
  };
};

const emptyAgendaDay = {
  "agenda-day-title": { "text": "Date" },
  "agenda-items": []
}

class MultidayAgenda extends React.Component {

  addDayToAgenda = () => {
    const newContent = [...this.props.content]
    newContent.push({...emptyAgendaDay})
    this.props.onSave(newContent)
  }

  deleteAgendaDay = index => () => {
    if (typeof window !== 'undefined')  {
      if (!window.confirm("Are you sure you want to delete this entire day from the agenda?")) {
        return false
      }

      const newContent = [...this.props.content]
      newContent.splice(index, 1)
      this.props.onSave(newContent)
    }
  }

  saveDayTitle = itemIndex => itemContent => {
    const newContent = [ ...this.props.content]
    newContent[itemIndex]["agenda-day-title"] = itemContent

    this.props.onSave(newContent)
  }

  onSaveAgendaItems = itemIndex => agendaItems => {
    const newContent = [ ...this.props.content]
    newContent[itemIndex]["agenda-items"] = agendaItems

    this.props.onSave(newContent)
  }

  render() {
    const { content } = this.props

    return (
      <div id="multiday-agenda" className={`collection width-100 mt-2 ${this.props.classes}`}>
        {content.map((agendaDay,index) => {
          return(
            <div key={`agenda-day-${index}`}>
              <h3 className="text-black display-flex align-center">
                <div className="circle-icon bg-gradient rotate-slow mr-2" />
                <EditableText content={agendaDay["agenda-day-title"]} onSave={this.saveDayTitle(index)} />
              </h3>
              {
                this.props.isEditingPage &&
                <div className="row mt-6 mb-4">
                  <div className="col-12">
                    <Button
                      onClick={this.deleteAgendaDay(index)}
                      color="default"
                      variant="contained">
                      Remove day from agenda
                    </Button>
                  </div>
                </div>
              }
              <AgendaList
                content={agendaDay["agenda-items"]}
                selectSpeaker={this.props.selectSpeaker}
                speakersArr={this.props.speakersArr}
                onSave={this.onSaveAgendaItems(index)}
              />
            </div>
          )
        })}

        {
          this.props.isEditingPage &&
          <div className="row mt-6 mb-4">
            <div className="col-12">
              <Button
                onClick={this.addDayToAgenda}
                color="default"
                variant="contained">
                Add day to agenda
              </Button>
            </div>
          </div>
        }
      </div>
    );
  }
}

MultidayAgenda.contextType = EditablesContext;


MultidayAgenda.defaultProps = {
  content: [],
  classes: "",
  onSave: () => { console.log('Implement a function to save changes') }
}

export default connect(mapStateToProps, null)(MultidayAgenda)

