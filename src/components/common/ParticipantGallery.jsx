import React from "react";
import Button from "@material-ui/core/Button"
import { connect } from "react-redux";
import Slider from "react-slick";

import ParticipantGalleryItem from "./ParticipantGalleryItem"
import ParticipantModal from "./ParticipantModal";
import ParticipantDetailModal from './ParticipantDetailModal'
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {EditablesContext, EditorWrapper, theme} from "react-easy-editables";
import Grid from "@material-ui/core/Grid";
import { fetchProfiles } from "../../redux/actions"

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ITEM_NUMBER = 36
const DEFAULT_SLIDES = 6

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
})

const mapDispatchToProps = dispatch => {
  return {
    fetchProfiles: () => {
      dispatch(fetchProfiles());
    },
  };
};

const mapStateToProps = state => {
  return {
    isEditingPage: state.adminTools.isEditingPage,
  };
};

class ParticipantGallery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      editingParticipant: null,
      showProfileModal: false,
      selectedProfile: this.props.selectedProfile,
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedProfile !== this.props.selectedProfile) {
      this.setState({
        ...this.state,
        selectedProfile: this.props.selectedProfile
      })
    }
  }

  onSaveItem = (itemId, itemContent) => {
    const newContent = {
      ...this.props.content,
      [itemId]: itemContent
    }

    this.props.onSave(newContent)
  }

  onDeleteItem = itemId => {
    let newContent = { ...this.props.content }
    delete newContent[itemId]

    console.log({newContent})

    this.props.onSave(newContent)
  }

  render() {
    const { showModal, editingParticipant, selectedProfile } = this.state;
    const itemsToShow = this.props.itemsToShow || ITEM_NUMBER;
    const profiles = Object.keys(this.props.content).map(key => this.props.content[key])
    const orderedProfiles = profiles.sort((a,b) => {
      if (a.date && b.date) {
        return b.date - a.date
      }

      if (a.date && !b.date) {
        return -1
      }

      if (b.date && !a.date) {
        return 1
      }

      return a.name.localeCompare(b.name)
    })

    const profilesToShow = orderedProfiles.slice(0, itemsToShow)
    const totalItems = profiles.length
    const slidesToShow = totalItems >= DEFAULT_SLIDES ? DEFAULT_SLIDES : totalItems

    const settings = {
      infinite: true,
      speed: 250,
      autoplay: !this.props.isEditingPage,
      autoplaySpeed: 10000,
      slidesToShow: slidesToShow,
      slidesToScroll: slidesToShow,
      dots: true,
      arrows: true,
      responsive: [
        {
          breakpoint: 960,
          settings: {
            slidesToShow: totalItems >= 4 ? 4 : totalItems,
            slidesToScroll: totalItems >= 4 ? 4 : totalItems,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: totalItems >= 3 ? 3 : totalItems,
            slidesToScroll: totalItems >= 3 ? 3 : totalItems,
          }
        },
        {
          breakpoint: 400,
          settings: {
            slidesToShow: totalItems >= 2 ? 2 : totalItems,
            slidesToScroll: totalItems >= 2 ? 2 : totalItems,
          }
        },
      ],
      appendDots: dots => (
        <div
          style={{
            padding: "10px"
          }}
        >
          <ul style={{ margin: "0", padding: "0" }}> {dots} </ul>
        </div>
      ),
      customPaging: i => (
        <div
          style={{
            width: "30px",
            color: "inherit",
            padding: "4px 8px",
            fontSize: '14px'
          }}
        >
          {i + 1}
        </div>
      )
    };

    return (
      <div id="participant-gallery" className={`collection width-100 mt-2 ${this.props.classes}`}>
        {
          this.props.isEditingPage &&
          <div className="row mt-6 mb-4">
            <div className="col-12">
              <Button
                onClick={() => this.setState({ ...this.state, showModal: true })}
                color="default"
                variant="contained">
                Add profile
              </Button>
            </div>
          </div>
        }
        <Slider {...settings} id="participants-slider">
          {profilesToShow.map((profile,index) => {
            return (
              <div
                className='pr-4'
                key={profile.id}>
                {
                  this.props.isEditingPage &&
                  <ThemeProvider theme={muiTheme}>
                    <EditorWrapper
                      theme={this.context.theme}
                      startEditing={() => this.setState({ ...this.state, showModal: true, editingParticipant: profile })}
                      isContentClickTarget={false}
                    >
                      <ParticipantGalleryItem content={profile} id={profile.id} />
                    </EditorWrapper>
                  </ThemeProvider>
                }
                {
                  !this.props.isEditingPage &&
                  <ParticipantGalleryItem
                    content={profile}
                    id={profile.id}
                    selectProfile={() => this.setState({ ...this.state, selectedProfile: profile })}
                  />
                }
              </div>
            )
          })}
          </Slider>
        {
          itemsToShow < totalItems &&
          <Grid container justify="center" className="mt-6">
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                className="btn"
                onClick={() => this.setState({ ...this.state, itemsToShow: this.state.itemsToShow + ITEM_NUMBER })}>
                Load more
              </Button>
            </Grid>
          </Grid>
        }

        <ParticipantDetailModal
          profile={selectedProfile}
          closeModal={() => this.setState({ ...this.state, selectedProfile: null })}
        />

        <ParticipantModal
          participant={editingParticipant}
          onSaveItem={this.onSaveItem}
          onDeleteItem={this.onDeleteItem}
          showModal={showModal}
          closeModal={() => this.setState({ ...this.state, showModal: false, editingParticipant: null })}
        />
      </div>
    );
  }
}

ParticipantGallery.contextType = EditablesContext;


ParticipantGallery.defaultProps = {
  content: {},
  classes: "",
  onSave: () => { console.log('Implement a function to save changes') }
}

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantGallery)

