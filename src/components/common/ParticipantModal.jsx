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

const emptyParticipant = {
  name: '',
  role: '',
  image: {},
  bio: '',
  email: ''
}

class ParticipantModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newParticipant: props.participant || emptyParticipant
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.participant !== this.props.participant && !Boolean(this.props.participant)) {
      this.setState({ newParticipant: emptyParticipant })
    }

    if (prevProps.participant !== this.props.participant && this.props.participant?.id) {
      this.setState({ newParticipant: this.props.participant })
    }
  }

  handleChange = key => event => {
    const value = event.currentTarget.value
    this.setState({ newParticipant: {...this.state.newParticipant, [key]: value} })
  }

  handleImageChange = key => image => {
    this.setState({ newParticipant: {...this.state.newParticipant, [key]: { imageSrc: image.imageSrc } } })
  }

  handleDescChange = key => desc => {
    this.setState({ newParticipant: {...this.state.newParticipant, [key]: desc.text} })
  }

  handleSaveProfile = () => {
    const { newParticipant } = this.state;
    const id = newParticipant.id ? newParticipant.id : `profile-${Date.now()}`

    const data = {
      ...newParticipant,
      date: Date.now(),
      id
    }

    // this.props.saveProfile(id, data)
    this.props.onSaveItem(id, data)
    this.props.closeModal()
    this.setState({ newParticipant: emptyParticipant })
  }

  handleCancel = () => {
    this.props.closeModal()
    this.setState({ newParticipant: emptyParticipant })
  }

  handleDeleteParticipant = () => {
    this.props.onDeleteItem(this.state.newParticipant.id)
    this.props.closeModal()
    this.setState({ newParticipant: emptyParticipant })
  }

  render() {
    const { handleDeleteParticipant, handleSaveProfile, handleChange, handleImageChange, handleCancel } = this;
    const { showModal, closeModal } = this.props;
    const {
      name,
      role,
      image,
      id,
      bio,
      email
    } = this.state.newParticipant;

    return (
      <Dialog open={showModal} onClose={closeModal} aria-labelledby="form-dialog-title" scroll="body">
        <DialogTitle id="form-dialog-title">{id ? 'Edit Participant' : 'Create a Profile' }</DialogTitle>
        <DialogContent>
          <ImageUpload
            content={image}
            onContentChange={handleImageChange('image')}
            uploadImage={uploadImage}
            label="Add a profile photo"
            round
          />
          <TextField
            value={name || ''}
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            onChange={handleChange('name')}
            variant="outlined"
            required
          />
          <TextField
            value={role || ''}
            margin="dense"
            id="role"
            label="Role"
            type="text"
            fullWidth
            onChange={handleChange('role')}
            variant="outlined"
            required
          />
          <TextField
            value={bio || ''}
            margin="dense"
            id="bio"
            label="Bio"
            type="text"
            fullWidth
            onChange={handleChange('bio')}
            variant="outlined"
            multiline
            rows={4}
          />
          <TextField
            value={email || ''}
            margin="dense"
            id="email"
            label="Email address"
            type="email"
            fullWidth
            onChange={handleChange('email')}
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
                  disabled={!name}
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

ParticipantModal.defaultProps = {
  onSaveItem: () => console.log("uh oh you're missing onSaveItem"),
  participant: emptyParticipant,
  showModal: false
}

export default connect(null, mapDispatchToProps)(ParticipantModal)

