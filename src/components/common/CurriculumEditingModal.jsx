import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ImageUpload from '../editing/ImageUpload';
import { uploadFile as uploadImage } from '../../aws/operations';
import produce from 'immer';

const TOPICS = ['Resilient', 'Intelligent', 'Sustainable', 'Equitable'];
const TYPES = [
  'Masterclass', 
  'Responsible Leadership', 
  'System Thinking', 
  'Storytelling', 
  'Measurement' 
];

const CurriculumEditingModal = (props) => {

  const { open, closeModal, onSave, onDelete } = props;

  const [ module, setModule ] = useState(null);

  useEffect(() => {
    if (props.module) {
      setModule(props.module);
    } else {
      setModule({
        image: {},
        title: '',
        summary: '',
        speaker: '',
        url: '',
        order: 1,
        topic: TOPICS[0],
        type: TYPES[0],
      });
    }
  }, [ props.module ]);

  const handleChange = (key) => (value) => {
    setModule(produce(module, (draft) => {
      draft[key] = value;
    }));
  };
  const handleChangeEvent = (key) => (e) => {
    handleChange(key)(e.target.value);
  };

  if (!module) return null;

  const isNew = !module.id;

  return (
    <Dialog maxWidth="sm" fullWidth open={open && Boolean(module)} PaperProps={{ square: true }} onClose={closeModal}>
      <DialogTitle>{isNew ? 'Create a Module' : 'Edit Module' }</DialogTitle>
      <DialogContent>
        <ImageUpload
          content={module.image}
          onContentChange={handleChange('image')}
          uploadImage={uploadImage}
          label="Add a photo"
        />
        <TextField
          value={module.title}
          margin="dense"
          id="title"
          label="Title"
          type="text"
          fullWidth
          onChange={handleChangeEvent('title')}
          variant="outlined"
          required
        />
        <TextField
          value={module.speaker}
          margin="dense"
          id="speaker"
          label="Speaker"
          type="text"
          fullWidth
          onChange={handleChangeEvent('speaker')}
          variant="outlined"
        />

        <div className="mt-2">
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="topic">Topic</InputLabel>
            <Select id="topic"
              label="Topic"
              value={module.topic}
              onChange={handleChangeEvent('topic')}>
              {TOPICS.map((topic) => (
                <MenuItem key={topic} value={topic}>
                  {topic}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="mt-2">
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="type">Type</InputLabel>
            <Select id="type"
              label="Type"
              value={module.type}
              onChange={handleChangeEvent('type')}>
              {TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <TextField
          value={module.summary}
          margin="dense"
          id="summary"
          label="Summary"
          type="text"
          fullWidth
          onChange={handleChangeEvent('summary')}
          variant="outlined"
          multiline
          rows={4}
        />
        <TextField
          value={module.url}
          margin="dense"
          id="url"
          label="URL"
          type="text"
          fullWidth
          onChange={handleChangeEvent('url')}
          variant="outlined"
        />
        <TextField
          value={module.order}
          margin="dense"
          id="order"
          label="Order"
          type="number"
          fullWidth
          onChange={handleChangeEvent('order')}
          variant="outlined"
        />

      </DialogContent>
      <DialogActions>
        <div className="pr-3 pl-3 pb-2 width-100">
          <Grid container justify="space-between">
            <Grid item>
              {
                !isNew &&
                <Button onClick={() => onDelete(module)} color="secondary">
                  Delete
                </Button>
              }
            </Grid>
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
                onClick={() => onSave(module)}
                color="primary"
                variant="contained"
                style={{borderRadius:0}}
                disabled={!module.title}
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

export default CurriculumEditingModal;