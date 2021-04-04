import React from "react";
import Button from "@material-ui/core/Button"
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import ImageUpload from '../editing/ImageUpload';
import {uploadFile as uploadImage} from "../../aws/operations";
import { saveEvent, removeEvent } from "../../redux/actions"
import { connect } from "react-redux";

const mapDispatchToProps = dispatch => {
  return {
    saveEvent: (id, event) => {
      dispatch(saveEvent(id, event));
    },
    removeEvent: (id) => {
      dispatch(removeEvent(id));
    },
  };
};

const emptyEvent = {
  title: '',
  description: '',
  image: {},
  date: '',
  location: '',
  url: '',
}

class EventModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newEvent: props.event || emptyEvent,
      errors: {}
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.event !== this.props.event && !Boolean(this.props.event)) {
      this.setState({ newEvent: emptyEvent })
    }

    if (prevProps.event !== this.props.event && this.props.event?.id) {
      this.setState({ newEvent: this.props.event })
    }
  }

  handleChange = key => event => {
    this.setState({ errors: {} })
    const value = event.currentTarget.value
    this.setState({ newEvent: {...this.state.newEvent, [key]: value} })
  }

  handleCheckboxChange = key => event => {
    this.setState({ errors: {} })
    const value = event.currentTarget.checked
    this.setState({ newEvent: {...this.state.newEvent, [key]: value} })
  }

  handleImageChange = key => image => {
    this.setState({ newEvent: {...this.state.newEvent, [key]: { imageSrc: image.imageSrc } } })
  }

  handleDescChange = key => desc => {
    this.setState({ newEvent: {...this.state.newEvent, [key]: desc.text} })
  }

  handleSaveEvent = () => {
    const { newEvent } = this.state;
    const id = newEvent.id ? newEvent.id : `event-${Date.now()}`

    const data = {
      ...newEvent,
      id
    }

    this.props.onSaveItem(id, data)
    this.props.closeModal()
    this.setState({ newEvent: emptyEvent })
  }

  handleCancel = () => {
    this.props.closeModal()
    this.setState({ newEvent: emptyEvent })
  }

  handleDeleteEvent = () => {
    this.props.onDeleteItem(this.state.newEvent.id)
    this.props.closeModal()
    this.setState({ newEvent: emptyEvent })
  }

  render() {
    const { handleDeleteEvent, handleSaveEvent, handleChange, handleCheckboxChange, handleImageChange, handleCancel } = this;
    const { showModal, closeModal } = this.props;
    const {
      id,
      image,
      title,
      description,
      location,
      date,
      url,
    } = this.state.newEvent;

    const { errors } = this.state;

    return (
      <Dialog open={showModal} onClose={closeModal} aria-labelledby="form-dialog-title" scroll="body">
        <DialogTitle id="form-dialog-title">{id ? 'Edit Event' : 'Create a Event' }</DialogTitle>
        <DialogContent>
          <ImageUpload
            content={image}
            onContentChange={handleImageChange('image')}
            uploadImage={uploadImage}
            label="Add a event photo"
            round
          />
          <TextField
            value={title || ''}
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            onChange={handleChange('title')}
            variant="outlined"
            required
          />
          <TextField
            value={description || ''}
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            onChange={handleChange('description')}
            variant="outlined"
            multiline
            rows={4}
          />
          <TextField
            value={location || ''}
            margin="dense"
            id="location"
            label="Location"
            type="text"
            fullWidth
            onChange={handleChange('location')}
            variant="outlined"
          />
          <TextField
            value={date || ''}
            margin="dense"
            id="date"
            label="Date"
            type="text"
            fullWidth
            onChange={handleChange('date')}
            variant="outlined"
          />
          <TextField
            value={url || ''}
            margin="dense"
            id="url"
            label="Website URL"
            type="url"
            fullWidth
            onChange={handleChange('url')}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <div className="pr-3 pl-3 pb-2 width-100">
            <Grid container justify="space-between">
              <Grid item>
                {
                  id &&
                  <Button onClick={handleDeleteEvent} color="secondary">
                    Delete
                  </Button>
                }
              </Grid>
              <Grid item>
                <Button
                  onClick={handleCancel}
                  color="default"
                  variant="text"
                  style={{borderRadius:0, marginRight: '8px'}}
                  disableElevation>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEvent}
                  color="primary"
                  variant="contained"
                  style={{borderRadius:0}}
                  disabled={!title || !date}
                  disableElevation>
                  Save
                </Button>
              </Grid>
            </Grid>
          </div>
        </DialogActions>
      </Dialog>
    );
  }

}

EventModal.defaultProps = {
  onSaveItem: () => console.log("uh oh you're missing onSaveItem"),
  event: emptyEvent,
  showModal: false
}

export default connect(null, mapDispatchToProps)(EventModal)

