import React from 'react';
import {
  Route,
  withRouter,
  Switch,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import * as logActions from '../../data/log/actions';
import * as noticeDialogActions from '../../../../data/noticeDialog/actions';
import { decompose } from '../../modules';
import AdminTable from '../../components/AdminTable';
import Dialog from '../../components/Dialog';

const inputStructure = [
  {
    name: '_id',
    key: ['_id'],
    type: 'string',
    readOnly: true,
    defaultValue: '자동 생성',
    tableOptions: ['disablePadding'],
    target: ['_id'],
  },
];
class Log extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      structure: inputStructure,
    };
    this.logRetrieveMany = this.logRetrieveMany.bind(this);
    this.logRemoveOne = this.logRemoveOne.bind(this);
    this.logRemoveMany = this.logRemoveMany.bind(this);
    this.handleClickItem = this.handleClickItem.bind(this);
    this.handleClickControls = this.handleClickControls.bind(this);
  }
  componentDidMount() {
    this.logRetrieveMany();
  }
  logRetrieveOne() {
    this.props.logRetrieveOneRequest()
      .then((data) => {
        if (this.props.logRetrieveOne.status === 'FAILURE') {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  logRetrieveMany() {
    this.props.logRetrieveManyRequest()
      .then((data) => {
        if (this.props.logRetrieveMany.status === 'FAILURE') {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  logRemoveOne(log) {
    this.props.logRemoveOneRequest(log)
      .then((data) => {
        if (this.props.logRemoveOne.status === 'SUCCESS') {
          this.props.changePage('/log');
          this.logRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  logRemoveMany(logs) {
    this.props.logRemoveManyRequest(logs)
      .then((data) => {
        if (this.props.logRemoveMany.status === 'SUCCESS') {
          this.props.changePage('/log');
          this.logRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  handleClickItem(item) {
    if (this.props.match.url[this.props.match.url.length - 1] === '/') {
      this.props.changePage(`${this.props.match.url}${item._id}`);
    } else {
      this.props.changePage(`${this.props.match.url}/${item._id}`);
    }
  }
  handleClickControls(control, data) {
    let obj;
    if (data) {
      obj = JSON.parse(JSON.stringify(data));
    }
    switch (control) {
      case 'toCreatePage':
        this.props.changePage(`${this.props.match.url}/create`);
        break;
      case 'goBack':
        this.props.history.goBack();
        break;
      case 'createOne':
        this.logCreateOne(obj);
        break;
      case 'modifyOne':
        this.logModifyOne(obj);
        break;
      case 'removeOne':
        this.logRemoveOne(obj);
        break;
      case 'removeMany':
        this.logRemoveMany(obj);
        break;
      default:
        break;
    }
  }
  render() {
    const {
      item, match, logRetrieveMany, logRetrieveOne, logRetrieveOneRequest,
    } = this.props;
    const { structure } = this.state;
    const { objArr, objArrMap } = decompose(logRetrieveMany.logs, structure);
    return (
      <Switch>
        <Route
          path={`${match.url}`}
          exact
          render={() => (
            <AdminTable
              title={item.name}
              data={objArr}
              dataMap={objArrMap}
              handleClickItem={this.handleClickItem}
              handleClickControls={this.handleClickControls}
            />
          )}
        />
        <Route
          path={`${match.url}/create`}
          render={() => (
            <Dialog
              title={`${item.name} 생성`}
              itemStructure={structure}
              handleClickControls={this.handleClickControls}
              mode="create"
            />
          )}
        />
        <Route
          path={`${match.url}/:id`}
          render={({ match }) => (
            <Dialog
              title={`${item.name} 수정`}
              itemStructure={structure}
              requestItem={logRetrieveOneRequest}
              item={logRetrieveOne.log}
              match={match}
              handleClickControls={this.handleClickControls}
              mode="modify"
            />
          )}
        />
      </Switch>
    );
  }
}
const mapStateToProps = state => ({
  logRetrieveOne: state.admin.data.log.retrieveOne,
  logRetrieveMany: state.admin.data.log.retrieveMany,
  logModifyOne: state.admin.data.log.modifyOne,
  logCreateOne: state.admin.data.log.createOne,
  logRemoveOne: state.admin.data.log.removeOne,
  logRemoveMany: state.admin.data.log.removeMany,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: path => push(path),
  noticeDialogOn: noticeDialogActions.on,
  noticeDialogOff: noticeDialogActions.off,
  showError: noticeDialogActions.error,
  logRetrieveOneRequest: logActions.retrieveOneRequest,
  logRetrieveManyRequest: logActions.retrieveManyRequest,
  logModifyOneRequest: logActions.modifyOneRequest,
  logCreateOneRequest: logActions.createOneRequest,
  logRemoveOneRequest: logActions.removeOneRequest,
  logRemoveManyRequest: logActions.removeManyRequest,
}, dispatch);
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Log));
