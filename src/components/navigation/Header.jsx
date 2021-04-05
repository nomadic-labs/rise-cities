import React from "react";
import ReactDOM from 'react-dom';
import { Link, navigate } from 'gatsby'
import logo from "../../assets/images/RISE_logo.svg"
import Hidden from "@material-ui/core/Hidden"

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
      <nav className={`navbar bg-white`}>
        <div className="logo">
          <Link to={'/'} className="display-flex"><img src={logo} alt="RISE Cities"/></Link>
        </div>
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
      </nav>
    );
  }
}

export default Header;
