import React from 'react';
import {
  Route,
  withRouter,
  Switch,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import * as accountActions from '../../data/account/actions';
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
    name: 'username',
    key: ['username'],
    type: 'string',
    target: ['username'],
    required: true,
  },
  {
    name: 'password',
    key: ['password'],
    type: 'string',
    target: ['password'],
    required: true,
  },
  {
    name: '등급',
    key: ['level'],
    type: 'string',
    form: 'selection',
    defaultValue: 'manager',
    formOptions: [{ label: '관리자', value: 'manager' }, { label: '매장', value: 'shop' }],
    target: ['level'],
    required: true,
  },
  {
    name: '연결 매장',
    key: ['connectedShop', 'name'],
    type: 'string',
    form: 'autoSuggest',
    defaultValue: '',
    formOptions: [],
    formOptionsRestriction: true,
    target: ['connectedShop'],
  },
];
class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      structure: inputStructure,
    };
    this.accountRetrieveMany = this.accountRetrieveMany.bind(this);
    this.accountModifyOne = this.accountModifyOne.bind(this);
    this.accountCreateOne = this.accountCreateOne.bind(this);
    this.accountRemoveOne = this.accountRemoveOne.bind(this);
    this.accountRemoveMany = this.accountRemoveMany.bind(this);
    this.shopRetrieveMany = this.shopRetrieveMany.bind(this);
    this.handleClickItem = this.handleClickItem.bind(this);
    this.handleClickControls = this.handleClickControls.bind(this);
  }
  componentDidMount() {
    this.accountRetrieveMany();
    this.shopRetrieveMany();
  }
  accountRetrieveOne() {
    this.props.accountRetrieveOneRequest()
      .then((data) => {
        if (this.props.accountRetrieveOne.status === 'SUCCESS') {
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  accountRetrieveMany() {
    this.props.accountRetrieveManyRequest()
      .then((data) => {
        if (this.props.accountRetrieveMany.status === 'SUCCESS') {
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  accountModifyOne(account) {
    this.props.accountModifyOneRequest(account)
      .then((data) => {
        if (this.props.accountModifyOne.status === 'SUCCESS') {
          this.props.changePage('/account');
          this.accountRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  accountCreateOne(account) {
    this.props.accountCreateOneRequest(account)
      .then((data) => {
        if (this.props.accountCreateOne.status === 'SUCCESS') {
          this.props.changePage('/account');
          this.accountRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  accountRemoveOne(account) {
    this.props.accountRemoveOneRequest(account)
      .then((data) => {
        if (this.props.accountRemoveOne.status === 'SUCCESS') {
          this.props.changePage('/account');
          this.accountRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  accountRemoveMany(accounts) {
    this.props.accountRemoveManyRequest(accounts)
      .then((data) => {
        if (this.props.accountRemoveMany.status === 'SUCCESS') {
          this.props.changePage('/account');
          this.accountRetrieveMany();
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
          const newState = JSON.parse(JSON.stringify(this.state));
          newState.structure.find(i => i.name === '연결 매장').formOptions =
            this.props.shopRetrieveMany.shops.map(shop => ({
              label: shop.name,
              value: shop.name,
            }));
          this.setState(newState);
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
    if (control === 'createOne' || control === 'modifyOne') {
      const shop = this.props.shopRetrieveMany.shops.find(shop => shop.name === data.connectedShop);
      if (shop) {
        obj.connectedShop = {
          _id: shop._id,
          name: shop.name,
        };
      } else {
        obj.connectedShop = null;
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
        this.accountCreateOne(obj);
        break;
      case 'modifyOne':
        this.accountModifyOne(obj);
        break;
      case 'removeOne':
        this.accountRemoveOne(obj);
        break;
      case 'removeMany':
        this.accountRemoveMany(obj);
        break;
      default:
        break;
    }
  }
  render() {
    const {
      item, match, accountRetrieveMany, accountRetrieveOne, accountRetrieveOneRequest,
    } = this.props;
    const { structure } = this.state;
    const { objArr, objArrMap } = decompose(accountRetrieveMany.accounts, structure);
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
              requestItem={accountRetrieveOneRequest}
              item={accountRetrieveOne.account}
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
  accountRetrieveOne: state.admin.data.account.retrieveOne,
  accountRetrieveMany: state.admin.data.account.retrieveMany,
  accountModifyOne: state.admin.data.account.modifyOne,
  accountCreateOne: state.admin.data.account.createOne,
  accountRemoveOne: state.admin.data.account.removeOne,
  accountRemoveMany: state.admin.data.account.removeMany,
  shopRetrieveMany: state.admin.data.shop.retrieveMany,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: path => push(path),
  noticeDialogOn: noticeDialogActions.on,
  noticeDialogOff: noticeDialogActions.off,
  showError: noticeDialogActions.error,
  accountRetrieveOneRequest: accountActions.retrieveOneRequest,
  accountRetrieveManyRequest: accountActions.retrieveManyRequest,
  accountModifyOneRequest: accountActions.modifyOneRequest,
  accountCreateOneRequest: accountActions.createOneRequest,
  accountRemoveOneRequest: accountActions.removeOneRequest,
  accountRemoveManyRequest: accountActions.removeManyRequest,
  shopRetrieveManyRequest: shopActions.retrieveManyRequest,
}, dispatch);
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Account));
