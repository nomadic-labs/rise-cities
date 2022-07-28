import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ImageUpload from '../editing/ImageUpload';
import { uploadFile as uploadImage } from '../../aws/operations';
import produce from 'immer';
import every from 'lodash/every';

const TandemEditingModal = (props) => {

  const { closeModal, onSave } = props;

  const [ tandem, setTandem ] = useState(props.tandem);

  useEffect(() => {
    setTandem(props.tandem);
  }, [ props.tandem ])

  const handleChange = (key) => (value) => {
    setTandem(produce(tandem, (draft) => {
      draft[key] = value;
    }));
  };
  const handleChangeEvent = (key) => (e) => {
    handleChange(key)(e.target.value);
  };

  if (!tandem) return null;

  // all required fields filled in
  const valid = every([ 
    tandem.title, tandem.city, tandem.country, tandem.lat, tandem.lon,
  ]);

  return (
    <Dialog maxWidth="sm" fullWidth open={Boolean(tandem)} PaperProps={{ square: true }} onClose={closeModal}>
      <DialogTitle>Edit Tandem</DialogTitle>
      <DialogContent>
        <ImageUpload
          content={tandem.image}
          onContentChange={handleChange('image')}
          uploadImage={uploadImage}
          label="Add a photo"
        />
        <TextField
          value={tandem.title}
          margin="dense"
          id="title"
          label="Title"
          type="text"
          fullWidth
          onChange={handleChangeEvent('title')}
          variant="outlined"
          required
        />

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              value={tandem.city}
              margin="dense"
              id="city"
              label="City"
              type="text"
              fullWidth
              onChange={handleChangeEvent('city')}
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              value={tandem.country}
              margin="dense"
              id="country"
              label="Country"
              type="text"
              fullWidth
              onChange={handleChangeEvent('country')}
              variant="outlined"
              required
            />
          </Grid>
        </Grid>

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              value={tandem.lat}
              margin="dense"
              id="lat"
              label="Latitude"
              type="number"
              fullWidth
              onChange={handleChangeEvent('lat')}
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              value={tandem.lon}
              margin="dense"
              id="lon"
              label="Longitude"
              type="number"
              fullWidth
              onChange={handleChangeEvent('lon')}
              variant="outlined"
              required
            />
          </Grid>
        </Grid>

        <TextField
          value={tandem.description}
          margin="dense"
          id="description"
          label="Description"
          type="text"
          fullWidth
          onChange={handleChangeEvent('description')}
          variant="outlined"
          multiline
          rows={4}
        />
        <TextField
          value={tandem.url}
          margin="dense"
          id="url"
          label="URL"
          type="text"
          fullWidth
          onChange={handleChangeEvent('url')}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <div className="pr-3 pl-3 pb-2 width-100">
          <Grid container justify="flex-end">
            <Grid item>
              <Button
                onClick={closeModal}
                color="default"
                variant="text"
                style={{borderRadius:0, marginRight: '8px'}}
                disableElevation>
                Cancel
              </Button>
              <Button
                onClick={() => onSave(tandem)}
                color="primary"
                variant="contained"
                style={{borderRadius:0}}
                disabled={!valid}
                disableElevation>
                Save
              </Button>
            </Grid>
          </Grid>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default TandemEditingModal;