import React from "react";
import slugify from "slugify";

import { connect } from "react-redux";
import {
  toggleNewPageModal,
  savePage,
  createPage,
  fetchPages,
} from "../../redux/actions";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { PAGE_TEMPLATES, CATEGORY_OPTIONS } from "../../utils/constants";

import defaultContentJSON from "../../fixtures/pageContent.json";
import eventContentJSON from "../../fixtures/eventPageContent.json";

const mapStateToProps = state => {
  return {
    showNewPageModal: state.adminTools.showNewPageModal,
    options: state.adminTools.options || {},
    page: state.page.data,
    pages: state.pages.pages,
    config: state.adminTools.config,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onToggleNewPageModal: () => {
      dispatch(toggleNewPageModal());
    },
    savePage: (pageData, pageId) => {
      dispatch(savePage(pageData, pageId));
    },
    createPage: (pageData, pageId) => {
      dispatch(createPage(pageData, pageId));
    },
    fetchPages: () => {
      dispatch(fetchPages())
    },
  };
};

const emptyPage = {
    title: "",
    description: "",
    author: "",
    externalLink: "",
    category: CATEGORY_OPTIONS[0].value,
    content: defaultContentJSON,
    template: PAGE_TEMPLATES[0].value,
    date: Date.now(),
    featured: false,
    registration: false,
    livestream: false,
  }

class CreatePageModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: this.props.options.new ? emptyPage : this.props.page,
      errors: {},
    };
    this.updatePage = (field, value) => {
      this._updatePage(field, value);
    };
    this.onSubmit = () => {
      this._onSubmit();
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.options !== this.props.options) {
      this.setState({ page: this.props.options.new ? emptyPage : {
        ...this.props.page
      } })
    }

    if (!prevProps.showNewPageModal && this.props.showNewPageModal) {
      this.props.fetchPages()
    }

    if (prevState.page.template !== this.state.page.template) {
      if (this.state.page.template === PAGE_TEMPLATES[0].value) { // article template
        this.setState({
          page: {
            ...this.state.page,
            category: CATEGORY_OPTIONS[0].value,
            content: defaultContentJSON
          }
        });
      } else if (this.state.page.template === PAGE_TEMPLATES[1].value) { // event template
        this.setState({
          page: {
            ...this.state.page,
            category: "uncategorized",
            content: eventContentJSON
          }
        });
      }
    }
  }

  _updatePage(field, value) {
    this.setState({
      errors: {
        ...this.state.errors,
        [field]: null
      },
      page: {
        ...this.state.page,
        [field]: value
      }
    });
  }

  isUniqueSlug = slug => {
    return !Boolean(this.props.pages[slug])
  }

  newPage = () => {
    const pageId = slugify(this.state.page.title, {
      lower: true,
      remove: /[$*_+~.,()'"!\-:@%^&?=]/g
    })

    if (!this.isUniqueSlug(pageId)) {
      return this.setState({
        errors: {
          ...this.state.errors,
          title: "The page title must be unique."
        }
      })
    }

    const pageData = {
      ...this.state.page,
      id: pageId,
      slug: `/${pageId}`,
      next: null,
      content: JSON.stringify(this.state.page.content),
    };

    this.props.createPage(pageData, pageId);

    console.log("Creating page", pageData)
  }

  editPage = () => {
    const pageData = {
      ...this.state.page,
      content: JSON.stringify(this.state.page.content)
    }
    this.props.savePage(pageData, this.props.page.id);

    console.log("Updating page", pageData)
  }

  _onSubmit() {
    if (this.props.options.edit) {
      return this.editPage()
    }

    return this.newPage()
  }

  render() {
    const open = Boolean(this.props.showNewPageModal);
    console.log(this.state.page)

    return (
      <Dialog open={open} aria-labelledby="create-page-dialogue">
        <DialogTitle id="create-page-dialogue">
          {"Page configuration"}
        </DialogTitle>


        <DialogContent>
          <FormControl fullWidth margin="normal">
            <TextField
              className="form-control"
              type="text"
              error={Boolean(this.state.errors.title)}
              helperText={this.state.errors.title}
              label={"Page title"}
              value={this.state.page.title}
              onChange={e => this.updatePage("title", e.currentTarget.value)}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              className="form-control"
              type="text"
              label={"Short summary"}
              value={this.state.page.description}
              onChange={e => this.updatePage("description", e.currentTarget.value)}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="menu-group-template">Page template</InputLabel>
            <Select
              value={this.state.page.template}
              onChange={selected =>
                this.updatePage("template", selected.target.value)
              }
              inputProps={{
                name: "menu-group-template",
                id: "menu-group-template"
              }}
            >
              {PAGE_TEMPLATES.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          { // article template
            this.state.page.template === PAGE_TEMPLATES[0].value &&
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="menu-group-category">Category</InputLabel>
                <Select
                  value={this.state.page.category}
                  onChange={selected =>
                    this.updatePage("category", selected.target.value)
                  }
                  inputProps={{
                    name: "menu-group-category",
                    id: "menu-group-category"
                  }}
                >
                  {CATEGORY_OPTIONS.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <TextField
                  className="form-control"
                  type="text"
                  label={"Author (optional)"}
                  value={this.state.page.author}
                  onChange={e => this.updatePage("author", e.currentTarget.value)}
                />
              </FormControl>

              <FormControl fullWidth margin="normal">
                <TextField
                  className="form-control"
                  type="text"
                  label={"External link (optional)"}
                  value={this.state.page.externalLink}
                  onChange={e => this.updatePage("externalLink", e.currentTarget.value)}
                />
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox checked={this.state.page.featured} onChange={e => this.updatePage("featured", e.currentTarget.checked)} value="featured" />
                }
                label={<p className="mb-0">Featured content</p>}
              />
            </>
          }


          { // event template
            this.state.page.template === PAGE_TEMPLATES[1].value &&
            <>
              <FormControl fullWidth margin="dense" style={{ marginTop: 0, marginBottom: 0 }}>
                <FormControlLabel
                  control={
                    <Checkbox checked={this.state.page.registration} onChange={e => this.updatePage("registration", e.currentTarget.checked)} value="registration" />
                  }
                  label={<p className="mb-0">Include registration section</p>}
                />
              </FormControl>

              <FormControl fullWidth margin="dense" style={{ marginTop: 0, marginBottom: 0 }}>
                <FormControlLabel
                  fullWidth
                  control={
                    <Checkbox checked={this.state.page.livestream} onChange={e => this.updatePage("livestream", e.currentTarget.checked)} value="livestream" />
                  }
                  label={<p className="mb-0">Include livestream section</p>}
                />
              </FormControl>
            </>
          }

        </DialogContent>

        <DialogActions>
          <Button color="secondary" onClick={this.props.onToggleNewPageModal}>
            Close
          </Button>
          <Button color="default" onClick={this.onSubmit}>
            { (this.props.options.new || this.props.options.duplicate) ? "Create page" : "Save" }
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}


CreatePageModal.defaultProps = {
  page: emptyPage
}

export default connect(mapStateToProps, mapDispatchToProps)(
  CreatePageModal
);
