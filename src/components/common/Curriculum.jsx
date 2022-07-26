import React, { useState, useEffect } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { useSelector, useDispatch } from 'react-redux';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import resilientIcon from '../../assets/images/icons/resilient-icon-32px.svg';
import intelligentIcon from '../../assets/images/icons/digital-icon-32px.svg';
import sustainableIcon from '../../assets/images/icons/sustainable-icon-32px.svg';
import equitableIcon from '../../assets/images/icons/inclusive-icon-32px.svg';

import groupBy from 'lodash/groupBy';
import CurriculumDetailModal from './CurriculumDetailModal';

import { EditorWrapper, theme } from 'react-easy-editables';
import CurriculumEditingModal from './CurriculumEditingModal';

import produce from 'immer';
import findIndex from 'lodash/findIndex';

import { saveCurriculum, deleteCurriculum } from '../../redux/actions';

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
});

const TOPICS = {
  Resilient: resilientIcon,
  Intelligent: intelligentIcon,
  Sustainable: sustainableIcon,
  Equitable: equitableIcon,
};

const CurriculumModule = (props) => {
  const { module, onClick } = props;
  const { title, type, image } = module;

  return (
    <Grid item xs={12} sm={4} className="curriculum-item">
      <button onClick={onClick}>
        { image.imageSrc && 
          <img src={image.imageSrc} alt={title} />
        }
        <p className="mb-1 mt-1 text-xs text-uppercase text-clamped">{type}</p>
        <h3 className="mb-0 mt-0">
          <span className="pretty-link">{title}</span>
        </h3>
      </button>
    </Grid>
  );
};

const Curriculum = (props) => {

  const { allCurriculum: { nodes } } = useStaticQuery(graphql`
    query CurriculumQuery {
      allCurriculum(sort: {fields: order, order: ASC}) {
        nodes {
          id
          speaker
          topic
          type
          summary
          title
          url
          image
          order
        }
      }
    }
  `);

  const [ curriculum, setCurriculum ] = useState([]);

  const [ selected, setSelected ] = useState(null);
  const [ isEditing, setEditing ] = useState(false);
  const [ editingModule, setEditingModule ] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    setCurriculum(nodes.map((node) => {
      return {
        ...node,
        image: node.image ? JSON.parse(node.image) : {}
      };
    }));
  }, [ nodes ]);

  const startEditing = (module) => {
    setEditing(true);
    setEditingModule(module);
  };

  const stopEditing = () => {
    setEditing(false);
    setEditingModule(null);
  };

  const onSave = (module) => {

    const { id, ...payload } = module;

    dispatch(saveCurriculum(id, {
      ...payload,
      image: JSON.stringify(payload.image)
    }));

    setCurriculum(produce(curriculum, (draft) => {
      if (module.id) {
        const index = findIndex(draft, { id: module.id });
        draft[index] = module;
      } else {
        draft.unshift(module);
      }
    }));

    stopEditing();
  };

  const onDelete = (module) => {

    const { id } = module;
    dispatch(deleteCurriculum(id));

    setCurriculum(produce(curriculum, (draft) => {
      const index = findIndex(draft, { id: module.id });
      draft.splice(index, 1);
    }));

    stopEditing();
  };

  const isEditingPage = useSelector((state) => state.adminTools.isEditingPage);

  if (curriculum.length === 0) return null;

  const topics = groupBy(curriculum, 'topic');

  return (
    <>

      <CurriculumDetailModal module={selected} closeModal={() => setSelected(null)} />

      <CurriculumEditingModal open={isEditing} 
        module={editingModule} 
        closeModal={stopEditing} 
        onSave={onSave}
        onDelete={onDelete}
      />

      { isEditingPage && 
        <Button
          onClick={() => startEditing(null)}
          color="default"
          variant="contained">
          Add module
        </Button>
      }

      { Object.keys(TOPICS).map((topic) => (
        <div key={topic} className="p-1">
          <Accordion
            square
            elevation={0}
            classes={{ root: 'curriculum-accordion' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <div className="display-flex align-center">
                <img src={TOPICS[topic]} height="40" alt={topic} />
                <span className="text-uppercase text-large ml-5">
                  {topic}
                </span>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="mb-3">
                <Grid container spacing={3}>
                  { topics[topic].map((module) => (
                    <React.Fragment key={module.id}>

                      { isEditingPage &&
                      <ThemeProvider theme={muiTheme}>
                        <EditorWrapper theme={theme} 
                          startEditing={() => startEditing(module)}>
                          <CurriculumModule module={module} />
                        </EditorWrapper>
                      </ThemeProvider>
                      }

                      { !isEditingPage &&
                      <CurriculumModule
                        module={module}
                        onClick={() => setSelected(module)} />
                      }

                    </React.Fragment>
                  ))}
                </Grid>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      ))}
    </>
  );
};

export default Curriculum;