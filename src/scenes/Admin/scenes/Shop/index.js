import React from 'react';
import {
  Route,
  withRouter,
  Switch,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import * as shopActions from '../../data/shop/actions';
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
  {
    name: 'name',
    key: ['name'],
    type: 'string',
    target: ['name'],
    required: true,
  },
  {
    name: 'phone',
    key: ['phone'],
    type: 'string',
    target: ['phone'],
    required: true,
  },
];
class Shop extends React.Component {
  constructor(props) {
    super(props);
    this.shopRetrieveMany = this.shopRetrieveMany.bind(this);
    this.shopModifyOne = this.shopModifyOne.bind(this);
    this.shopCreateOne = this.shopCreateOne.bind(this);
    this.shopRemoveOne = this.shopRemoveOne.bind(this);
    this.shopRemoveMany = this.shopRemoveMany.bind(this);
    this.handleClickItem = this.handleClickItem.bind(this);
    this.handleClickControls = this.handleClickControls.bind(this);
  }
  componentDidMount() {
    this.shopRetrieveMany();
  }
  shopRetrieveOne() {
    this.props.shopRetrieveOneRequest()
      .then((data) => {
        if (this.props.shopRetrieveOne.status === 'SUCCESS') {
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  shopRetrieveMany() {
    this.props.shopRetrieveManyRequest()
      .then((data) => {
        if (this.props.shopRetrieveMany.status === 'SUCCESS') {
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  shopModifyOne(shop) {
    this.props.shopModifyOneRequest(shop)
      .then((data) => {
        if (this.props.shopModifyOne.status === 'SUCCESS') {
          this.props.changePage('/shop');
          this.shopRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  shopCreateOne(shop) {
    this.props.shopCreateOneRequest(shop)
      .then((data) => {
        if (this.props.shopCreateOne.status === 'SUCCESS') {
          this.props.changePage('/shop');
          this.shopRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  shopRemoveOne(shop) {
    this.props.shopRemoveOneRequest(shop)
      .then((data) => {
        if (this.props.shopRemoveOne.status === 'SUCCESS') {
          this.props.changePage('/shop');
          this.shopRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  shopRemoveMany(shops) {
    this.props.shopRemoveManyRequest(shops)
      .then((data) => {
        if (this.props.shopRemoveMany.status === 'SUCCESS') {
          this.props.changePage('/shop');
          this.shopRetrieveMany();
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
    if (control === 'createOne') {
      obj._id = undefined;
    }
    switch (control) {
      case 'toCreatePage':
        this.props.changePage(`${this.props.match.url}/create`);
        break;
      case 'goBack':
        this.props.history.goBack();
        break;
      case 'createOne':
        this.shopCreateOne(data);
        break;
      case 'modifyOne':
        this.shopModifyOne(data);
        break;
      case 'removeOne':
        this.shopRemoveOne(data);
        break;
      case 'removeMany':
        this.shopRemoveMany(data);
        break;
      default:
        break;
    }
  }
  render() {
    const {
      item, match, shopRetrieveMany, shopRetrieveOne, shopRetrieveOneRequest,
    } = this.props;
    const { objArr, objArrMap } = decompose(shopRetrieveMany.shops, inputStructure);
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
          render={({ match }) => (
            <Dialog
              title={`${item.name} 생성`}
              itemStructure={inputStructure}
              handleClickControls={this.handleClickControls}
              mode="create"
              match={match}
            />
          )}
        />
        <Route
          path={`${match.url}/:id`}
          render={({ match }) => (
            <Dialog
              title={`${item.name} 수정`}
              itemStructure={inputStructure}
              requestItem={shopRetrieveOneRequest}
              item={decompose([shopRetrieveOne.shop], inputStructure).objArr[0]}
              handleClickControls={this.handleClickControls}
              mode="modify"
              match={match}
            />
          )}
        />
      </Switch>
    );
  }
}
const mapStateToProps = state => ({
  shopRetrieveOne: state.admin.data.shop.retrieveOne,
  shopRetrieveMany: state.admin.data.shop.retrieveMany,
  shopModifyOne: state.admin.data.shop.modifyOne,
  shopCreateOne: state.admin.data.shop.createOne,
  shopRemoveOne: state.admin.data.shop.removeOne,
  shopRemoveMany: state.admin.data.shop.removeMany,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: path => push(path),
  noticeDialogOn: noticeDialogActions.on,
  noticeDialogOff: noticeDialogActions.off,
  showError: noticeDialogActions.error,
  shopRetrieveOneRequest: shopActions.retrieveOneRequest,
  shopRetrieveManyRequest: shopActions.retrieveManyRequest,
  shopModifyOneRequest: shopActions.modifyOneRequest,
  shopCreateOneRequest: shopActions.createOneRequest,
  shopRemoveOneRequest: shopActions.removeOneRequest,
  shopRemoveManyRequest: shopActions.removeManyRequest,
}, dispatch);
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Shop));
