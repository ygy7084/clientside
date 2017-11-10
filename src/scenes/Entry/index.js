import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Login from './components/Login';
import * as loginActions from './data/login/actions';
import * as authActions from '../../data/auth/actions';
import { turnOnSimpleMessage } from '../../components/SimpleMessage/index';

class Entry extends React.Component {
  constructor(props) {
    super(props);
    this.loginHandler = this.loginHandler.bind(this);
  }
  loginHandler(account) {
    this.props.loginRequest({
      username: account.inputId,
      password: account.inputPassword,
    })
      .then((data) => {
        if (this.props.login.status === 'SUCCESS') {
          this.props.authRequest();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        turnOnSimpleMessage.error('로그인 실패');
      });
  }
  render() {
    return (
      <div>
        <Login
          onLogin={this.loginHandler}
        />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.data.auth,
  login: state.entry.data.login,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  authRequest: authActions.request,
  loginRequest: loginActions.request,
}, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Entry);
