import React from "react";
import Button from "@material-ui/core/Button"
import { connect } from "react-redux";
import Slider from "react-slick";

import PartnerGalleryItem from "./PartnerGalleryItem"
import PartnerModal from "./PartnerModal";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {EditablesContext, EditorWrapper, theme} from "react-easy-editables";
import Grid from "@material-ui/core/Grid";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ITEM_NUMBER = 12
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

const mapStateToProps = state => {
  return {
    isEditingPage: state.adminTools.isEditingPage,
  };
};

class PartnerGallery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      editingPartner: null,
      itemsToShow: ITEM_NUMBER,
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

    this.props.onSave(newContent)
  }

  render() {
    const { showModal, editingPartner, itemsToShow } = this.state;
    const partners = Object.keys(this.props.content).map(key => this.props.content[key])
    const orderedPartners = [...partners].sort((a, b) => {
      const orderA = a.order || 9999;
      const orderB = b.order || 9999;
      if (orderA !== orderB) return orderA - orderB;

      return a.name.localeCompare(b.name);
    });

    const partnersToShow = orderedPartners.slice(0, itemsToShow)
    const totalItems = partners.length
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
      <div id="partner-gallery" className={`collection width-100 mt-2 ${this.props.classes}`}>
        {
          this.props.isEditingPage &&
          <div className="row mt-6 mb-4">
            <div className="col-12">
              <Button
                onClick={() => this.setState({ showModal: true })}
                color="default"
                variant="contained">
                Add partner
              </Button>
            </div>
          </div>
        }
        <Slider {...settings}>
          {partnersToShow.map((partner,index) => {
            return (
              <div
                className='pr-4'
                key={partner.id}>
                {
                  this.props.isEditingPage &&
                  <ThemeProvider theme={muiTheme}>
                    <EditorWrapper
                      theme={this.context.theme}
                      startEditing={() => this.setState({ showModal: true, editingPartner: partner })}
                      isContentClickTarget={false}
                    >
                      <PartnerGalleryItem content={partner} id={partner.id} />
                    </EditorWrapper>
                  </ThemeProvider>
                }
                {
                  !this.props.isEditingPage &&
                  <PartnerGalleryItem content={partner} id={partner.id} />
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
                onClick={() => this.setState({ itemsToShow: this.state.itemsToShow + ITEM_NUMBER })}>
                Load more
              </Button>
            </Grid>
          </Grid>
        }

        <PartnerModal
          partner={editingPartner}
          onSaveItem={this.onSaveItem}
          showModal={showModal}
          closeModal={() => this.setState({ showModal: false, editingPartner: null })}
          onDeleteItem={this.onDeleteItem}
        />
      </div>
    );
  }
}

PartnerGallery.contextType = EditablesContext;


PartnerGallery.defaultProps = {
  content: {},
  classes: "",
  onSave: () => { console.log('Implement a function to save changes') }
}

export default connect(mapStateToProps, null)(PartnerGallery)

