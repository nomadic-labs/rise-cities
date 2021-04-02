import React from "react";
import ReactDOM from 'react-dom';
import { Link, navigate } from 'gatsby'
import logo from "../../assets/images/RISE_logo.svg"

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
      document.querySelector(e.target.getAttribute('href')).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
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
        <a className='menu-item' href="#intro" onClick={this.handleClick}>Featured Content</a>
        <a className='menu-item' href="#program" onClick={this.handleClick}>Program</a>
        <a className='menu-item' href="#connecting-tree" onClick={this.handleClick}>RISE City Lab</a>
        <a className='menu-item' href="#participants" onClick={this.handleClick}>Events</a>
        <a className='menu-item' href="#connect" onClick={this.handleClick}>People</a>
        <a className='menu-item' href="#session-materials" onClick={this.handleClick}>Partners</a>
      </div>
    )
  }

  render() {
    return (
      <nav className={`navbar bg-white`}>
        <div className="logo">
          <Link to={'/'} className="display-flex"><img src={logo} alt="BMW Foundation | Herbert Quant"/></Link>
        </div>
          <div className='navbar-items'>
            <a className='navbar-item menu-item' href="#menu" onClick={this.toggleMenu}>{this.state.menuIsOpen ? 'Close' : 'Menu'}</a>
            <a className='navbar-item' href="#intro" onClick={this.handleClick}>Featured Content</a>
            <a className='navbar-item' href="#program" onClick={this.handleClick}>Program</a>
            <a className='navbar-item' href="#connecting-tree" onClick={this.handleClick}>RISE City Lab</a>
            <a className='navbar-item' href="#participants" onClick={this.handleClick}>Events</a>
            <a className='navbar-item' href="#connect" onClick={this.handleClick}>People</a>
            <a className='navbar-item' href="#session-materials" onClick={this.handleClick}>Partners</a>
          </div>
          {
            this.container && ReactDOM.createPortal(this.menu(), this.container)
          }
      </nav>
    );
  }
}

export default Header;
