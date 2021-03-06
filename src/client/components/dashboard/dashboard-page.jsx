import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import DashboardHeader from './dashboard-header.jsx';
import DashboardProjectContainer from './dashboard-project-container.jsx';
const Router = require('react-router');
const request = require('superagent');

export default class DashboardPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeProject: null,
      projects: [],
      fetchingApplicationData: false
    };
  }

  componentWillMount() {
    if (page.data.user && page.data.user._id) {
      this.loadProjects();
    } else {
      Router.browserHistory.push('/');
    }
  }

  loadProjects() {
    if (page.data.projects.length > 0) {
      this.setState({
        projects: page.data.projects
      });
    } else {
      this.setState({
        fetchingApplicationData: true
      });

      request
        .post('/api/app/all')
        .withCredentials()
        .end((err, res) => {
          page.data.projects = JSON.parse(res.text);
          this.setState({
            projects: page.data.projects,
            fetchingApplicationData: false
          });
        });
    }
  }

  logout() {
    window.location.href = '/logout';
  }

  render() {
    return (
      <div className="dashboard">
        <DashboardHeader/>
        <div className="dashboard-body">
          <div className="dashboard-sidebar">
            <h2>Your Apps</h2>
            <ul>
              {this.renderApps()}
            </ul>
            <a onClick={() => {
              Router.browserHistory.push('/dashboard/new');
            }}><button>New Application</button></a>
          </div>
          <div className="dashboard-content">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }

  renderApps() {
    // console.log('this.state.projects',this.state.projects);
    if(this.state.fetchingApplicationData) {
      return (
        <div className="applicationSidebarLoading">Loading...</div>
      );
    } else if(this.state.projects && this.state.projects.length < 10) {
      return this.state.projects.map((project) => {
        return (
          <li key={project._id} className="floating-hover">
            <a href={'/dashboard/' + project.name}>{project.name}</a>
          </li>
        );
      });
    }
  }

}
