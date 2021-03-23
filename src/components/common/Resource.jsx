import React from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import {
  PlainTextEditor,
  RichTextEditor,
  ImageUploadEditor,
  LinkEditor,
  Editable
} from 'react-easy-editables';

import T from './Translation'
import { uploadImage } from "../../firebase/operations"

class ResourceEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { content: this.props.content };
  }

  handleEditorChange = field => item => {
    this.setState({
      content: {
        ...this.state.content,
        [field]: {
          ...item
        }
      }
    });
  }

  render() {
    const { content } = this.state;

    return(
      <Card className={`resource-item ${this.props.classes}`} variant="outlined" square={true}>
        <CardContent className="card-body">
          <div className="">
            <ImageUploadEditor
              content={content["resource-item-image"]}
              handleEditorChange={this.handleEditorChange("resource-item-image")}
              uploadImage={uploadImage}
            />
          </div>

          <div className="card-title">
            <h4 className="text-primary">
              <PlainTextEditor
                content={content["resource-item-title"]}
                handleEditorChange={this.handleEditorChange("resource-item-title")}
              />
            </h4>
          </div>

          <div className="author">
            <PlainTextEditor
              content={content["resource-item-author"]}
              handleEditorChange={this.handleEditorChange("resource-item-author")}
            />
          </div>

          <div className="card-text" style={{ color: "#000000"}}>
            <RichTextEditor
              content={content["resource-item-description"]}
              handleEditorChange={this.handleEditorChange("resource-item-description")}
            />
          </div>

          <div className="link" style={{ marginBottom: "1rem" }}>
            <LinkEditor
              content={content["resource-item-link"]}
              handleEditorChange={this.handleEditorChange("resource-item-link")}
              editCaption={false}
            />
          </div>
        </CardContent>
      </Card>
    )
  }
}

const Resource = props => {

  const content = props.content || {};

  const handleSave = newContent => {
    props.onSave(newContent)
  }

  return (
    <Editable
      Editor={ResourceEditor}
      handleSave={handleSave}
      content={content}
      {...props}
    >
      <Card className={`resource-item ${props.classes}`} variant="outlined" square={true}>
        {
          content["resource-item-image"] &&
          <div className="thumbnail">
            <img className="img-zoom" src={content["resource-item-image"]["imageSrc"]} alt={content["resource-item-image"]["caption"]} />
          </div>
        }
        <CardContent className="card-body">
          <div className="card-title">
            <h4 className="">
              { content["resource-item-title"]["text"] }
            </h4>
          </div>

          <div className="author">
            {content["resource-item-author"]["text"]}
          </div>

          <div className="description" dangerouslySetInnerHTML={ {__html: content["resource-item-description"]["text"]} }>
          </div>

          <div className="link">
            <a href={content["resource-item-link"]["link"]} target="_blank" rel="noopener noreferrer">
              { content["resource-item-link"]["anchor"] ? content["resource-item-link"]["anchor"] : <T id="open_resource" /> }
            </a>
          </div>
        </CardContent>
      </Card>
    </Editable>
  );
};

Resource.defaultProps = {
  content: {
    "resource-item-author": { "text": "Author" },
    "resource-item-title": { "text": "Title" },
    "resource-item-description": { "text": "<p>Summary</p>" },
    "resource-item-link": { "link": "/" },
  },
  classes: "",
  onSave: () => { console.log('implement a function to save changes') }
}

export default Resource;
