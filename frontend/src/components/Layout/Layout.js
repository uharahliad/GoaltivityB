import React, { useEffect } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import classnames from 'classnames';

import SettingsIcon from '@mui/icons-material/Settings';
import GithubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

import { Fab, IconButton } from '@mui/material';
import { connect } from 'react-redux';
// styles
import useStyles from './styles';

// components
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { Link } from '../Wrappers';
import ColorChangeThemePopper from './components/ColorChangeThemePopper';

import EditUser from '../../pages/user/EditUser';

// pages
import Dashboard from '../../pages/dashboard';
import BreadCrumbs from '../../components/BreadCrumbs';

// context
import { useLayoutState } from '../../context/LayoutContext';

import UsersFormPage from 'pages/CRUD/Users/form/UsersFormPage';
import UsersTablePage from 'pages/CRUD/Users/table/UsersTablePage';

import GoalsFormPage from 'pages/CRUD/Goals/form/GoalsFormPage';
import GoalsTablePage from 'pages/CRUD/Goals/table/GoalsTablePage';

import Goal_categoriesFormPage from 'pages/CRUD/Goal_categories/form/Goal_categoriesFormPage';
import Goal_categoriesTablePage from 'pages/CRUD/Goal_categories/table/Goal_categoriesTablePage';

import Success_criteriaFormPage from 'pages/CRUD/Success_criteria/form/Success_criteriaFormPage';
import Success_criteriaTablePage from 'pages/CRUD/Success_criteria/table/Success_criteriaTablePage';

import Action_itemsFormPage from 'pages/CRUD/Action_items/form/Action_itemsFormPage';
import Action_itemsTablePage from 'pages/CRUD/Action_items/table/Action_itemsTablePage';

import Accountability_groupsFormPage from 'pages/CRUD/Accountability_groups/form/Accountability_groupsFormPage';
import Accountability_groupsTablePage from 'pages/CRUD/Accountability_groups/table/Accountability_groupsTablePage';

import MessagesFormPage from 'pages/CRUD/Messages/form/MessagesFormPage';
import MessagesTablePage from 'pages/CRUD/Messages/table/MessagesTablePage';

const Redirect = (props) => {
  useEffect(() => window.location.replace(props.url));
  return <span>Redirecting...</span>;
};

function Layout(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const id = open ? 'add-section-popover' : undefined;
  const handleClick = (event) => {
    setAnchorEl(open ? null : event.currentTarget);
  };

  // global
  let layoutState = useLayoutState();

  return (
    <div className={classes.root}>
      <Header history={props.history} />
      <Sidebar />
      <div
        className={classnames(classes.content, {
          [classes.contentShift]: layoutState.isSidebarOpened,
        })}
      >
        <div className={classes.fakeToolbar} />
        <BreadCrumbs />
        <Switch>
          <Route path='/admin/dashboard' component={Dashboard} />
          <Route path='/admin/user/edit' component={EditUser} />
          <Route
            path={'/admin/api-docs'}
            exact
            component={(props) => (
              <Redirect
                url={
                  process.env.NODE_ENV === 'production'
                    ? window.location.origin + '/api-docs'
                    : 'http://localhost:8080/api-docs'
                }
                {...props}
              />
            )}
          />

          <Route path={'/admin/users'} exact component={UsersTablePage} />
          <Route path={'/admin/users/new'} exact component={UsersFormPage} />
          <Route
            path={'/admin/users/:id/edit'}
            exact
            component={UsersFormPage}
          />

          <Route path={'/admin/goals'} exact component={GoalsTablePage} />
          <Route path={'/admin/goals/new'} exact component={GoalsFormPage} />
          <Route
            path={'/admin/goals/:id/edit'}
            exact
            component={GoalsFormPage}
          />

          <Route
            path={'/admin/goal_categories'}
            exact
            component={Goal_categoriesTablePage}
          />
          <Route
            path={'/admin/goal_categories/new'}
            exact
            component={Goal_categoriesFormPage}
          />
          <Route
            path={'/admin/goal_categories/:id/edit'}
            exact
            component={Goal_categoriesFormPage}
          />

          <Route
            path={'/admin/success_criteria'}
            exact
            component={Success_criteriaTablePage}
          />
          <Route
            path={'/admin/success_criteria/new'}
            exact
            component={Success_criteriaFormPage}
          />
          <Route
            path={'/admin/success_criteria/:id/edit'}
            exact
            component={Success_criteriaFormPage}
          />

          <Route
            path={'/admin/action_items'}
            exact
            component={Action_itemsTablePage}
          />
          <Route
            path={'/admin/action_items/new'}
            exact
            component={Action_itemsFormPage}
          />
          <Route
            path={'/admin/action_items/:id/edit'}
            exact
            component={Action_itemsFormPage}
          />

          <Route
            path={'/admin/accountability_groups'}
            exact
            component={Accountability_groupsTablePage}
          />
          <Route
            path={'/admin/accountability_groups/new'}
            exact
            component={Accountability_groupsFormPage}
          />
          <Route
            path={'/admin/accountability_groups/:id/edit'}
            exact
            component={Accountability_groupsFormPage}
          />

          <Route path={'/admin/messages'} exact component={MessagesTablePage} />
          <Route
            path={'/admin/messages/new'}
            exact
            component={MessagesFormPage}
          />
          <Route
            path={'/admin/messages/:id/edit'}
            exact
            component={MessagesFormPage}
          />
        </Switch>
        <Fab
          color='primary'
          aria-label='settings'
          onClick={(e) => handleClick(e)}
          className={classes.changeThemeFab}
          style={{ zIndex: 100 }}
        >
          <SettingsIcon style={{ color: '#fff' }} />
        </Fab>
        <ColorChangeThemePopper id={id} open={open} anchorEl={anchorEl} />
        <Footer>
          <div>
            <Link
              color={'primary'}
              href={'https://flatlogic.com/'}
              target={'_blank'}
              className={classes.link}
            >
              Flatlogic
            </Link>
            <Link
              color={'primary'}
              href={'https://flatlogic.com/about'}
              target={'_blank'}
              className={classes.link}
            >
              About Us
            </Link>
            <Link
              color={'primary'}
              href={'https://flatlogic.com/blog'}
              target={'_blank'}
              className={classes.link}
            >
              Blog
            </Link>
          </div>
          <div>
            <Link href={'https://www.facebook.com/flatlogic'} target={'_blank'}>
              <IconButton aria-label='facebook'>
                <FacebookIcon style={{ color: '#6E6E6E99' }} />
              </IconButton>
            </Link>
            <Link href={'https://twitter.com/flatlogic'} target={'_blank'}>
              <IconButton aria-label='twitter'>
                <TwitterIcon style={{ color: '#6E6E6E99' }} />
              </IconButton>
            </Link>
            <Link href={'https://github.com/flatlogic'} target={'_blank'}>
              <IconButton
                aria-label='github'
                style={{ padding: '12px 0 12px 12px' }}
              >
                <GithubIcon style={{ color: '#6E6E6E99' }} />
              </IconButton>
            </Link>
          </div>
        </Footer>
      </div>
    </div>
  );
}

export default withRouter(connect()(Layout));
