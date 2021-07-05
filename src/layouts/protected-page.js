import React from "react";
import { connect } from "react-redux";
import { navigate, Link } from 'gatsby';
import { FirebaseAuth } from 'react-firebaseui';

import firebase from "../firebase/init";

import {
  userLoggedIn,
  userLoggedOut,
  deleteAccount,
} from "../redux/actions";


const mapStateToProps = state => {
  const allowEditing = state.adminTools.user && state.adminTools.user.isEditor;

  return {
    isLoggedIn: state.adminTools.isLoggedIn,
    allowEditing: allowEditing,
    user: state.adminTools.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userLoggedIn: user => {
      dispatch(userLoggedIn(user));
    },
    userLoggedOut: () => {
      dispatch(userLoggedOut());
    },
    deleteAccount: () => {
      dispatch(deleteAccount());
    },
  };
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    flexDirection: 'column'
  }
}

const uiConfig = {
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  credentialHelper: 'NONE',
  callbacks: {
      signInSuccessWithAuthResult: () => navigate('/admin')
    }
};

class ProtectedPage extends React.Component {
  state = { firebaseAuth: null }

  componentDidMount() {
    this.setState({ firebaseAuth: firebase.auth() }, () => {
      this.state.firebaseAuth.onAuthStateChanged(user => {
        if (user) {
          const ref = firebase
            .app()
            .firestore()
            .collection('users')
            .doc(user.uid);

          ref.get().then(snapshot => {
            const userData = snapshot.data();
            if (userData) {
              this.props.userLoggedIn(userData);
            } else {
              const newUser = {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL
              };
              ref.set(newUser);
              this.props.userLoggedIn(newUser);
            }
          });
        } else {
          this.props.userLoggedOut();
        }
      });
    })
  }

  render () {
    if (this.state.loading) {
      return <div className="width-100 height-100 display-flex justify-center align-center mt-10 mb-10"><div className="loader">loading...</div></div>
    }

    if (this.props.isLoggedIn && this.props.allowEditing) {
      return <div>{this.props.children}</div>
    }

    if (this.props.isLoggedIn && !this.props.allowEditing) {
      return (
        <div className="width-100 height-100 display-flex flex-column justify-center align-center mt-10 mb-10">
          <p>You are not authorized to see this page.</p>
          <Link to={'/'} className="ml-2">Go to the home page.</Link>
          <div className="mt-10 mb-10">
            <button onClick={this.props.deleteAccount} className="btn btn-dark">Delete my account</button>
          </div>
        </div>
      )
    }

    return (
      <div style={styles.container} className="mb-15">
        <h1>Sign up / Sign in</h1>
        <p>By creating an account you agree to our <a href="https://bmw-foundation.org/privacy-policy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</p>
        {this.state.firebaseAuth && <FirebaseAuth uiConfig={uiConfig} firebaseAuth={this.state.firebaseAuth} />}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedPage);
