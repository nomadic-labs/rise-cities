import React from "react";
import Button from "@material-ui/core/Button"
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ImageUpload from '../editing/ImageUpload';
import {uploadFile as uploadImage} from "../../aws/operations";
import { saveEvent, removeEvent } from "../../redux/actions"
import { connect } from "react-redux";
import { 
  MuiPickersUtilsProvider,
  KeyboardDatePicker, 
  KeyboardTimePicker,
} from "@material-ui/pickers";
import TimezoneSelect from "./TimezoneSelect";
import LuxonUtils from "@date-io/luxon";
import { DateTime } from "luxon";

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
  startDate: DateTime.local(),
  endDate: DateTime.local(),
  startTime: DateTime.fromISO('00:00'),
  endTime: DateTime.fromISO('00:00'),
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  location: '',
  url: '',
}

class EventModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newEvent: props.event || emptyEvent
    }

    console.log('initial state', this.state.newEvent);
  }

  componentDidUpdate(prevProps) {

    console.log('componentDidUpdate', prevProps.event, this.props.event, this.state.newEvent);

    if (prevProps.event !== this.props.event && !Boolean(this.props.event)) {
      console.log('initial', emptyEvent);
      this.setState({ newEvent: emptyEvent })
    }

    if (prevProps.event !== this.props.event && this.props.event?.id) {
      const { event } = this.props;
      const timezone = event.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
      const eventCopy = {
        ...event,
        startDate: event.startDate ? DateTime.fromISO(event.startDate) : null,
        endDate: event.endDate ? DateTime.fromISO(event.endDate) : null,
        startTime: event.startTime ? DateTime.fromISO(event.startTime): null,
        endTime: event.endTime ? DateTime.fromISO(event.endTime): null,
        timezone
      };

      console.log('initial', eventCopy);
      this.setState({ newEvent: eventCopy })
    }
  }

  handleChange = key => event => {
    const value = event.currentTarget.value
    this.setState({ newEvent: {...this.state.newEvent, [key]: value} })
  }

  handleValueChange = key => value => {
    console.log('handleValueChange', key, value);
    this.setState({ newEvent: {...this.state.newEvent, [key]: value }})
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

    console.log('form state', newEvent);

    const startDate = newEvent.startDate ? newEvent.startDate.toISODate() : '';
    const endDate = newEvent.endDate ? newEvent.endDate.toISODate() : '';
    const startTime = newEvent.startTime ? newEvent.startTime.toISOTime() : '';
    const endTime = newEvent.endTime ? newEvent.endTime.toISOTime() : '';

    const data = {
      ...newEvent,
      startDate,
      endDate,
      startTime,
      endTime,
      id
    }

    console.log('saving data', data);

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
    const { handleDeleteEvent, handleSaveEvent, handleChange, handleValueChange, handleImageChange, handleCancel } = this;
    const { showModal, closeModal } = this.props;
    const {
      id,
      image,
      title,
      description,
      location,
      date,
      startDate,
      endDate,
      startTime,
      endTime,
      timezone,
      url,
    } = this.state.newEvent;

    console.log('render', startDate, startTime);

    return (
      <MuiPickersUtilsProvider utils={LuxonUtils}>
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
          <Grid container>
            <Grid item xs={6}>
              <KeyboardDatePicker
                value={startDate}
                onChange={handleValueChange('startDate')}
                format="yyyy/MM/dd"
                margin="dense"
                id="startDate"
                label="Start Date"
                inputVariant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <KeyboardDatePicker
                value={endDate}
                onChange={handleValueChange('endDate')}
                format="yyyy/MM/dd"
                margin="dense"
                id="endDate"
                label="End Date"
                inputVariant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <KeyboardTimePicker
                value={startTime}
                onChange={handleValueChange('startTime')}
                format="HH:mm"
                margin="dense"
                id="startTime"
                label="Start Time"
                inputVariant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <KeyboardTimePicker
                value={endTime}
                onChange={handleValueChange('endTime')}
                format="HH:mm"
                margin="dense"
                id="endTime"
                label="End Time"
                inputVariant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <label className="text-small" htmlFor="timezone">Timezone</label>
            <TimezoneSelect
              handleChange={handleValueChange('timezone')}
              name="timezone"
              id="timezone"
              className="mb-2"
              value={timezone}
            />
          </Grid>
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
                  disabled={!title}
                  disableElevation>
                  Save
                </Button>
              </Grid>
            </Grid>
          </div>
        </DialogActions>
      </Dialog>
      </MuiPickersUtilsProvider>
    );
  }

}

EventModal.defaultProps = {
  onSaveItem: () => console.log("uh oh you're missing onSaveItem"),
  event: emptyEvent,
  showModal: false
}

export default connect(null, mapDispatchToProps)(EventModal)

