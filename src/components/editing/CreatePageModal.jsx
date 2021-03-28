import React from "react";
import slugify from "slugify";
import { find } from 'lodash';

import { connect } from "react-redux";
import {
  toggleNewPageModal,
  savePage,
  updateFirestoreDoc,
  fetchPages,
} from "../../redux/actions";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { PAGE_TYPES, LANGUAGE_OPTIONS, CATEGORY_OPTIONS } from "../../utils/constants";

import defaultContentJSON from "../../fixtures/pageContent.json";

const mapStateToProps = state => {
  return {
    showNewPageModal: state.adminTools.showNewPageModal,
    options: state.adminTools.options || {},
    page: state.page.data,
    pages: state.pages.pages,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onToggleNewPageModal: () => {
      dispatch(toggleNewPageModal());
    },
    updateFirestoreDoc: (pageId, data) => {
      dispatch(updateFirestoreDoc(pageId, data))
    },
    savePage: (pageData, pageId) => {
      dispatch(savePage(pageData, pageId));
    },
    fetchPages: () => {
      dispatch(fetchPages())
    },
  };
};

const emptyPage = {
    title: "",
    description: "",
    category: CATEGORY_OPTIONS[0].value,
    lang: LANGUAGE_OPTIONS[0].value,
    content: defaultContentJSON,
    template: PAGE_TYPES[0].value.template,
  }

class CreatePageModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: this.props.page,
      errors: {},
    };
    this.updatePage = (field, value) => {
      this._updatePage(field, value);
    };
    this.onSubmit = () => {
      this._onSubmit();
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.options !== this.props.options) {
      this.setState({ page: this.props.options.new ? emptyPage : {
        ...this.props.page
      } })
    }

    if (!prevProps.showNewPageModal && this.props.showNewPageModal) {
      this.props.fetchPages()
      if (this.props.options.duplicate || this.props.options.translation) {
        const newPage = {
          ...this.props.page,
          title: `${this.props.page.title} (copy)`,
          translation: null,
          next: null,
        }
        this.setState({ page: newPage, errors: {} })
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
      slug: `/${this.state.page.lang}/${pageId}`,
      next: null,
      content: JSON.stringify(this.state.page.content),
    };

    this.props.savePage(pageData, pageId);

    const prevPage = find(this.props.pages, (page => page.category === this.state.page.category && page.lang === this.state.page.lang && !page.next));

    if (prevPage && this.state.page.category !== 'uncategorized') { // don't add next page for uncategorized pages
      this.props.updateFirestoreDoc(prevPage.id, { next: pageId })
    }
  }

  editPage = () => {
    const pageData = {
      ...this.state.page,
      content: JSON.stringify(this.state.page.content)
    }
    this.props.savePage(pageData, this.props.page.id);
  }

  translatePage = () => {
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

    const prevPage = find(this.props.pages, (page => page.category === this.state.page.category && page.lang === this.state.page.lang && !page.next));

    let pageData = {
      ...this.state.page,
      content: JSON.stringify(this.state.page.content),
      id: pageId,
      slug: `/${this.state.page.lang}/${pageId}`,
      next: null,
      translation: this.props.page.slug
    };

    this.props.savePage(pageData, pageId);

    if (prevPage && this.state.page.category !== 'uncategorized') { // don't add next page for uncategorized pages
      this.props.updateFirestoreDoc(prevPage.id, { next: pageId })
    }

    this.props.updateFirestoreDoc(this.props.page.id, { translation: pageData.slug })
  }

  _onSubmit() {
    if (this.props.options.edit) {
      return this.editPage()
    }

    if (this.props.options.translation) {
      return this.translatePage()
    }

    return this.newPage()
  }

  render() {
    const open = Boolean(this.props.showNewPageModal);

    return (
      <Dialog open={open} aria-labelledby="create-page-dialogue">
        <DialogTitle id="create-page-dialogue">
          {"Module configuration"}
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
              label={"Short description"}
              value={this.state.page.description}
              onChange={e => this.updatePage("description", e.currentTarget.value)}
            />
          </FormControl>

          {
            !this.props.options.edit &&
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="menu-group">Language</InputLabel>
              <Select
                value={this.state.page.lang}
                onChange={selected =>
                  this.updatePage("lang", selected.target.value)
                }
                inputProps={{
                  name: "menu-group",
                  id: "menu-group"
                }}
              >
                {LANGUAGE_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          }

          {
            this.props.options.new &&
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="menu-group">Category</InputLabel>
              <Select
                value={this.state.page.category}
                onChange={selected =>
                  this.updatePage("category", selected.target.value)
                }
                inputProps={{
                  name: "menu-group",
                  id: "menu-group"
                }}
              >
                {CATEGORY_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
