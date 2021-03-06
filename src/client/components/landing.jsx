const request = require('superagent');

import React, { PropTypes } from 'react';

const Router = require('react-router');
const Layout = require('./layout.jsx');

class Landing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navState: 'LANDING',
      email: ''
    };
  }

  componentWillMount() {
    this.checkCookie();
  }

  componentWillUpdate(nextProps, nextState) {
    this.checkCookie();
  }

  checkCookie() {
    if (page.data.user._id) {
      Router.browserHistory.push('/dashboard');
    }
  }

  sendVerificationEmail() {
    if(this.state.navState === 'SENT' || this.state.navState === 'ALREADY_SENT') {
      this.setNavState('ALREADY_SENT');
      return;
    }

    const purdueEmailRegex = new RegExp('@purdue.edu\s*$');

    if (!purdueEmailRegex.test(this.state.email)) {
      // On an invalid email, display a message and get outta here!
      this.setNavState('BAD_EMAIL');
      return;
    }
    this.setNavState('SENT');

    request
      .post('/signup')
      .set('Content-Type', 'application/json')
      .send({
        email: this.state.email
      })
      .withCredentials()
      .end((err, res) => {
        if (res.statusCode != 200) {
          this.setNavState('FAILED_REQUEST');
        } else {
          this.setNavState('SENT');
        }
      });
  }

  setNavState(newNavState) {
    this.setState({
      navState: newNavState
    });
  }

  setEmail(newEmail) {
    this.setState({
      email: newEmail
    });
  }

  renderMessage() {
    if (this.state.navState === 'SENT') {
      return (
        <div className="text-container">
          <p className="small">
            &#10003; We{'\''}ve sent you an email with a verification link in it.
            Please open it and click on the link so we can ensure you{'\''}re a Purdue student.
          </p>
        </div>
      );
    } else if (this.state.navState === 'BAD_EMAIL') {
      return (
        <div className="text-container">
          <p className="small">
            <span className="red-text">Invalid email. Please use a @purdue.edu email.</span> Something wrong? Shoot us an email at usb@cs.purdue.edu
          </p>
        </div>
      );
    } else if (this.state.navState === 'FAILED_REQUEST') {
      return (
        <div className="text-container">
          <p className="small">
            <span className="red-text">Unable to sign up. Check your internet connection? Do you already have an account?</span> Something wrong? Shoot us an email at usb@cs.purdue.edu
          </p>
        </div>
      );
    } else if (this.state.navState === 'ALREADY_SENT') {
      return (
        <div className="text-container">
          <p className="small">
            <span className="red-text">We{'\''}ve already sent you an email!</span>
          </p>
        </div>
      );
    }
  }

  render() {
    return (
      <Layout>
        <div className="hero">
          <div className="container">
            <div className="text-container">
              <h1>Pley</h1>
              <p>
                Pley is a free web application hosting service for Purdue students, built by Purdue students. Get your website up and running so fast.
              </p>
            </div>
            <div className="emailForm">
              <input
                type="text"
                className="emailInput"
                placeholder="Email"
                onChange={e => {
                  this.setEmail(e.target.value);
                }}
                value={this.state.email}
              />
              <button
                onClick={() => {
                  this.sendVerificationEmail();
                }}>
                Sign Up &rarr;
              </button>
            </div>
            {this.renderMessage()}
          </div>
        </div>
      </Layout>
    );
  }
}

module.exports = Landing;