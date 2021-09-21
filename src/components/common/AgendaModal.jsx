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
import { saveProfile, removeProfile } from "../../redux/actions"
import { connect } from "react-redux";

const mapDispatchToProps = dispatch => {
  return {
    saveProfile: (id, profile) => {
      dispatch(saveProfile(id, profile));
    },
    removeProfile: (id) => {
      dispatch(removeProfile(id));
    },
  };
};

const emptyItem = {
  title: '',
  startTime: '',
  endTime: '',
  image: {},
  description: '',
  speakers: ''
}

class AgendaModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      agendaItem: props.agendaItem || emptyItem
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.agendaItem !== this.props.agendaItem && !Boolean(this.props.agendaItem)) {
      this.setState({ agendaItem: emptyItem })
    }

    if (prevProps.agendaItem !== this.props.agendaItem && this.props.agendaItem?.id) {
      this.setState({ agendaItem: this.props.agendaItem })
    }
  }

  handleChange = key => event => {
    const value = event.currentTarget.value
    this.setState({ agendaItem: {...this.state.agendaItem, [key]: value} })
  }

  handleDescChange = key => desc => {
    this.setState({ agendaItem: {...this.state.agendaItem, [key]: desc.text} })
  }

  handleSaveProfile = () => {
    const { agendaItem } = this.state;
    const id = agendaItem.id ? agendaItem.id : `agenda-${Date.now()}`

    const data = {
      ...agendaItem,
      date: Date.now(),
      id
    }

    // this.props.saveProfile(id, data)
    this.props.onSaveItem(id, data)
    this.props.closeModal()
    this.setState({ agendaItem: emptyItem })
  }

  handleCancel = () => {
    this.props.closeModal()
    this.setState({ agendaItem: emptyItem })
  }

  handleDeleteParticipant = () => {
    this.props.onDeleteItem(this.state.agendaItem.id)
    this.props.closeModal()
    this.setState({ agendaItem: emptyItem })
  }

  render() {
    const { handleDeleteParticipant, handleSaveProfile, handleChange, handleImageChange, handleCancel } = this;
    const { showModal, closeModal } = this.props;
    const {
      title,
      startTime,
      endTime,
      image,
      id,
      description,
      speakers
    } = this.state.agendaItem;

    return (
      <Dialog open={showModal} onClose={closeModal} aria-labelledby="form-dialog-title" scroll="body">
        <DialogTitle id="form-dialog-title">{id ? 'Edit Agenda Item' : 'Create an Agenda Item' }</DialogTitle>
        <DialogContent>
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
            value={startTime || ''}
            margin="dense"
            id="startTime"
            label="Start time"
            type="text"
            fullWidth
            onChange={handleChange('startTime')}
            variant="outlined"
            required
          />
          <TextField
            value={endTime || ''}
            margin="dense"
            id="endTime"
            label="End time"
            type="text"
            fullWidth
            onChange={handleChange('endTime')}
            variant="outlined"
            required
          />
          <TextField
            value={speakers || ''}
            margin="dense"
            id="speakers"
            label="Speakers"
            type="speakers"
            fullWidth
            onChange={handleChange('speakers')}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <div className="pr-3 pl-3 pb-2 width-100">
            <Grid container justify="space-between">
              <Grid item>
                {
                  id &&
                  <Button onClick={handleDeleteParticipant} color="secondary">
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
                  onClick={handleSaveProfile}
                  color="primary"
                  variant="contained"
                  style={{borderRadius:0}}
                  disabled={!title || !startTime || !endTime}
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

AgendaModal.defaultProps = {
  onSaveItem: () => console.log("uh oh you're missing onSaveItem"),
  agendaItem: emptyItem,
  showModal: false
}

export default connect(null, mapDispatchToProps)(AgendaModal)

