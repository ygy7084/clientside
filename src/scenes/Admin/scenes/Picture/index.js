import React from 'react';
import {
  Route,
  withRouter,
  Switch,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import * as pictureActions from '../../data/picture/actions';
import * as noticeDialogActions from '../../../../data/noticeDialog/actions';
import { decompose } from '../../modules';
import AdminTable from '../../components/AdminTable';
import ImageInputDialog from '../../components/ImageInputDialog';

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
  {
    name: 'fileName',
    key: ['fileName'],
    type: 'string',
    target: ['fileName'],
    readOnly: true,
    defaultValue: '자동 생성',
  },
  {
    name: 'path',
    key: ['path'],
    type: 'string',
    target: ['path'],
    readOnly: true,
    defaultValue: '자동 생성',
  },
];
class Picture extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      structure: inputStructure,
    };
    this.pictureRetrieveMany = this.pictureRetrieveMany.bind(this);
    this.pictureModifyOne = this.pictureModifyOne.bind(this);
    this.pictureCreateOne = this.pictureCreateOne.bind(this);
    this.pictureRemoveOne = this.pictureRemoveOne.bind(this);
    this.pictureRemoveMany = this.pictureRemoveMany.bind(this);
    this.handleClickItem = this.handleClickItem.bind(this);
    this.handleClickControls = this.handleClickControls.bind(this);
  }
  componentDidMount() {
    this.pictureRetrieveMany();
  }
  pictureRetrieveOne() {
    this.props.pictureRetrieveOneRequest()
      .then((data) => {
        if (this.props.pictureRetrieveOne.status === 'FAILURE') {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  pictureRetrieveMany() {
    this.props.pictureRetrieveManyRequest()
      .then((data) => {
        if (this.props.pictureRetrieveMany.status === 'FAILURE') {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  pictureModifyOne(picture, file) {
    this.props.pictureModifyOneRequest(picture, file)
      .then((data) => {
        if (this.props.pictureModifyOne.status === 'SUCCESS') {
          this.props.changePage('/picture');
          this.pictureRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  pictureCreateOne(picture, file) {
    this.props.pictureCreateOneRequest(picture, file)
      .then((data) => {
        if (this.props.pictureCreateOne.status === 'SUCCESS') {
          this.props.changePage('/picture');
          this.pictureRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  pictureRemoveOne(picture) {
    this.props.pictureRemoveOneRequest(picture)
      .then((data) => {
        if (this.props.pictureRemoveOne.status === 'SUCCESS') {
          this.props.changePage('/picture');
          this.pictureRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  pictureRemoveMany(pictures) {
    this.props.pictureRemoveManyRequest(pictures)
      .then((data) => {
        if (this.props.pictureRemoveMany.status === 'SUCCESS') {
          this.props.changePage('/picture');
          this.pictureRetrieveMany();
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
  handleClickControls(control, data, file) {
    let obj;
    if (data) {
      obj = JSON.parse(JSON.stringify(data));
    }
    if (control === 'createOne') {
      obj._id = undefined;
      obj.fileName = undefined;
      obj.path = undefined;
      if (this.props.auth.user && this.props.auth.user.account) {
        obj.accountId = this.props.auth.user.account._id;
      }
    }
    switch (control) {
      case 'toCreatePage':
        this.props.changePage(`${this.props.match.url}/create`);
        break;
      case 'goBack':
        this.props.history.goBack();
        break;
      case 'createOne':
        this.pictureCreateOne(obj, file);
        break;
      case 'modifyOne':
        this.pictureModifyOne(obj, file);
        break;
      case 'removeOne':
        this.pictureRemoveOne(obj);
        break;
      case 'removeMany':
        this.pictureRemoveMany(obj);
        break;
      default:
        break;
    }
  }
  render() {
    const {
      item, match, pictureRetrieveMany, pictureRetrieveOne, pictureRetrieveOneRequest,
    } = this.props;
    const { structure } = this.state;
    const { objArr, objArrMap } = decompose(pictureRetrieveMany.pictures, structure);
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
            <ImageInputDialog
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
            <ImageInputDialog
              title={`${item.name} 수정`}
              itemStructure={structure}
              requestItem={pictureRetrieveOneRequest}
              item={pictureRetrieveOne.picture}
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
  auth: state.data.auth,
  pictureRetrieveOne: state.admin.data.picture.retrieveOne,
  pictureRetrieveMany: state.admin.data.picture.retrieveMany,
  pictureModifyOne: state.admin.data.picture.modifyOne,
  pictureCreateOne: state.admin.data.picture.createOne,
  pictureRemoveOne: state.admin.data.picture.removeOne,
  pictureRemoveMany: state.admin.data.picture.removeMany,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: path => push(path),
  noticeDialogOn: noticeDialogActions.on,
  noticeDialogOff: noticeDialogActions.off,
  showError: noticeDialogActions.error,
  pictureRetrieveOneRequest: pictureActions.retrieveOneRequest,
  pictureRetrieveManyRequest: pictureActions.retrieveManyRequest,
  pictureModifyOneRequest: pictureActions.modifyOneRequest,
  pictureCreateOneRequest: pictureActions.createOneRequest,
  pictureRemoveOneRequest: pictureActions.removeOneRequest,
  pictureRemoveManyRequest: pictureActions.removeManyRequest,
}, dispatch);
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Picture));
