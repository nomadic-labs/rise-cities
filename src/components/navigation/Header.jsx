import React from "react";
import ReactDOM from 'react-dom';
import { Link, navigate } from 'gatsby'
import logo from "../../assets/images/RISE_logo.svg"
import Container from "@material-ui/core/Container"
import Hidden from "@material-ui/core/Hidden"
import Grid from "@material-ui/core/Grid"

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      menuIsOpen: false
    }
  }

  componentDidMount() {
    this.appRoot = document.querySelector('.nl-page');
    this.container = document.createElement('div');
    this.appRoot.appendChild(this.container);

    if (typeof(window) !== 'undefined') {
      window.onscroll = () => {
        console.log("scrolling!", document.body.scrollTop)
        if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
          document.getElementById("navbar").classList.add("navbar-small");
        } else {
          document.getElementById("navbar").classList.remove("navbar-small");
        }
      }
    }
  }

  handleClick = (e) => {
    e.preventDefault();
    this.setState({ menuIsOpen: false })

    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      navigate(`/${e.target.getAttribute('href')}`)
    } else {
      const el = document.querySelector(e.target.getAttribute('href'))
      const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  }

  toggleMenu = (e) => {
    e.preventDefault();
    this.setState({ menuIsOpen: !this.state.menuIsOpen })
  }

  onSave = id => content => {
    this.props.onUpdatePageData("home", id, content);
  };

  menu = () => {
    return (
      <div className={`menu animate__animated animate__slideInDown ${this.state.menuIsOpen ? 'is-active' : ''}`}>
        <a className='menu-item' href="#featured" onClick={this.handleClick}>Featured Content</a>
        <a className='menu-item' href="#program" onClick={this.handleClick}>Program</a>
        <a className='menu-item' href="#rise-city-lab" onClick={this.handleClick}>RISE City Lab</a>
        <a className='menu-item' href="#events" onClick={this.handleClick}>Events</a>
        <a className='menu-item' href="#people" onClick={this.handleClick}>People</a>
        <a className='menu-item' href="#partners" onClick={this.handleClick}>Partners</a>
      </div>
    )
  }

  render() {
    return (
      <nav id="navbar" style={{ paddingTop: '15px' }}>
        <Container>
          <Grid container justify="space-between">
            <Grid item>
              <div className="logo">
                <Link to={'/'} className="display-flex"><img src={logo} alt="RISE Cities"/></Link>
              </div>
            </Grid>
            <Grid item>
              <Hidden smDown>
                <div className='navbar-items'>
                  <a className='navbar-item' href="#featured" onClick={this.handleClick}>Featured Content</a>
                  <a className='navbar-item' href="#program" onClick={this.handleClick}>Program</a>
                  <a className='navbar-item' href="#rise-city-lab" onClick={this.handleClick}>RISE City Lab</a>
                  <a className='navbar-item' href="#events" onClick={this.handleClick}>Events</a>
                  <a className='navbar-item' href="#people" onClick={this.handleClick}>People</a>
                  <a className='navbar-item' href="#partners" onClick={this.handleClick}>Partners</a>
                </div>
              </Hidden>
              <Hidden mdUp>
                <div className='navbar-items'>
                  <a className='navbar-item menu-item' href="#menu" onClick={this.toggleMenu}>{this.state.menuIsOpen ? 'Close' : 'Menu'}</a>
                  {
                    this.container && ReactDOM.createPortal(this.menu(), this.container)
                  }
                </div>
              </Hidden>
            </Grid>
          </Grid>
        </Container>
      </nav>
    );
  }
}

export default Header;
