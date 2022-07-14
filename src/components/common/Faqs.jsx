import React from "react";
import Button from "@material-ui/core/Button"
import { connect } from "react-redux";
import ExpandableText from "./ExpandableText"

const mapStateToProps = state => {
  return {
    isEditingPage: state.adminTools.isEditingPage,
  };
};

const emptyFaq = {
  "header": "Header",
  "description": "Description"
}

class Faqs extends React.Component {

  addFaq = () => {
    const newContent = [...this.props.content]
    newContent.push({...emptyFaq})
    this.props.onSave(newContent)
  }

  deleteFaq = index => () => {
    const newContent = [...this.props.content]
    newContent.splice(index, 1)
    this.props.onSave(newContent)
  }

  updateFaq = index => updatedContent => {
    const newContent = [...this.props.content]
    newContent[index] = updatedContent
    this.props.onSave(newContent)
  }

  render() {
    const { content } = this.props

    return (
      <div id="faqs" className={`collection width-100 mt-2 ${this.props.classes}`}>
        {content.map((faq,index) => {
          return(
            <div className="mb-2" key={`faq-${index}`}>
              <ExpandableText content={faq} onSave={this.updateFaq(index)} onDelete={this.deleteFaq(index)} />
            </div>
          )
        })}

        {
          this.props.isEditingPage &&
          <div className="row mt-6 mb-4">
            <div className="col-12">
              <Button
                onClick={this.addFaq}
                color="default"
                variant="contained">
                Add item
              </Button>
            </div>
          </div>
        }
      </div>
    );
  }
}

Faqs.defaultProps = {
  content: [],
  classes: "",
  onSave: () => { console.log('Implement a function to save changes') }
}

export default connect(mapStateToProps, null)(Faqs)

