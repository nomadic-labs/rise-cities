import React, { useEffect } from "react";
import { connect } from "react-redux";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import AOS from 'aos';

import {
  savePageContent,
  addSection,
  duplicateSection,
  deleteSection,
  addContentItem,
  updateContentItem,
  deleteContentItem,
} from "../../redux/actions";

import Header from "../common/Header";
import SubHeading from "../common/SubHeading";
import Paragraph from "../common/Paragraph";
import Image from "../common/Image";
import ImageCarousel from "../common/ImageCarousel";
import Readings from "../common/Readings";
import Questions from "../common/Questions";
import Podcasts from "../common/Podcasts";
import Resources from "../common/Resources";
import EmbeddedIframe from "../common/EmbeddedIframe";
import Button from "../common/Button";
import Link from "../common/Link";
import Quote from "../common/Quote";
import YoutubeVideoPlaylist from "../common/YoutubeVideoPlaylist";
import ExpandableText from "../common/ExpandableText";
import SectionEditingActions from "./SectionEditingActions";

const componentMap = {
  header: Header,
  subHeading: SubHeading,
  paragraph: Paragraph,
  image: Image,
  imageCarousel: ImageCarousel,
  embeddedIframe: EmbeddedIframe,
  button: Button,
  link: Link,
  quote: Quote,
  readings: Readings,
  questions: Questions,
  podcasts: Podcasts,
  resources: Resources,
  videos: YoutubeVideoPlaylist,
  expandableText: ExpandableText,
}

const mapDispatchToProps = dispatch => {
  return {
    addSection: (sectionIndex, sectionType) => {
      dispatch(addSection(sectionIndex, sectionType));
    },
    deleteSection: (sectionIndex) => {
      dispatch(deleteSection(sectionIndex));
    },
    duplicateSection: (sectionIndex) => {
      dispatch(duplicateSection(sectionIndex));
    },
    addContentItem: (sectionIndex, contentType) => {
      dispatch(addContentItem(sectionIndex, contentType))
    },
    updateContentItem: (sectionIndex, contentIndex, content) => {
      dispatch(updateContentItem(sectionIndex, contentIndex, content))
    },
    deleteContentItem: (sectionIndex, contentIndex) => {
      dispatch(deleteContentItem(sectionIndex, contentIndex))
    },
    savePageContent: (innerFunction) => {
      dispatch(savePageContent(innerFunction));
    },
  };
};

const mapStateToProps = state => {
  return {
    pageData: state.page.data,
    isEditingPage: state.adminTools.isEditingPage,
  };
};


const DynamicSection = ({ content, type, sectionIndex, pageData, isEditingPage, savePageContent, addSection, deleteSection, duplicateSection, addContentItem, updateContentItem, deleteContentItem }) => {
  useEffect(() => {
    AOS.init({ delay: 50, duration: 400 })
  });

  const onAddSection = (sectionType) => {
    savePageContent(() => addSection(sectionIndex, sectionType))
  }

  const onDeleteSection = () => {
    savePageContent(() => deleteSection(sectionIndex))
  }

  const onDuplicateSection = () => {
    savePageContent(() => duplicateSection(sectionIndex))
  }

  const onAddContentItem = (contentType) => {
    savePageContent(() => addContentItem(sectionIndex, contentType))
  }

  const onUpdateContentItem = (sectionIndex, contentIndex) => content => {
    savePageContent(() => updateContentItem(sectionIndex, contentIndex, content))
  }

  const onDeleteContentItem = (sectionIndex, contentIndex) => () => {
    savePageContent(() => deleteContentItem(sectionIndex, contentIndex))
  }

  return(
    <section className={`dynamic-section position-relative ${type} pb-8`}>
      <Container data-aos="fade-up" data-aos-offset="100">
        <Grid container>
          <Grid item sm={10} md={8}>
            {
              content.map((component, index ) => {
                const Component = componentMap[component.type];
                return (
                  <Component
                    content={component.content}
                    onSave={onUpdateContentItem(sectionIndex, index)}
                    onDelete={onDeleteContentItem(sectionIndex, index)}
                    key={index}
                    isEditingPage={isEditingPage}
                  />
                )
              })
            }
          </Grid>
        </Grid>
      </Container>
      {
        isEditingPage &&
        <SectionEditingActions
          onDuplicateSection={onDuplicateSection}
          onDeleteSection={onDeleteSection}
          onAddSection={onAddSection}
          onAddContentItem={onAddContentItem}
        />
      }
    </section>
  )
};


export default connect(mapStateToProps, mapDispatchToProps)(DynamicSection);
