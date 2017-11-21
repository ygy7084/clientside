import React from 'react';
import {
  Route,
  withRouter,
  Switch,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import * as customerActions from '../../data/customer/actions';
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
    name: '번호',
    key: ['phone'],
    type: 'string',
    onlyNumber: true,
    target: ['phone'],
  },
  {
    name: '이름',
    key: ['name'],
    type: 'string',
    target: ['name'],
    required: true,
  },
];
class Customer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      structure: inputStructure,
    };
    this.customerRetrieveMany = this.customerRetrieveMany.bind(this);
    this.customerModifyOne = this.customerModifyOne.bind(this);
    this.customerCreateOne = this.customerCreateOne.bind(this);
    this.customerRemoveOne = this.customerRemoveOne.bind(this);
    this.customerRemoveMany = this.customerRemoveMany.bind(this);
    this.handleClickItem = this.handleClickItem.bind(this);
    this.handleClickControls = this.handleClickControls.bind(this);
  }
  componentDidMount() {
    this.customerRetrieveMany();
  }
  customerRetrieveOne() {
    this.props.customerRetrieveOneRequest()
      .then((data) => {
        if (this.props.customerRetrieveOne.status !== 'SUCCESS') {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  customerRetrieveMany() {
    this.props.customerRetrieveManyRequest()
      .then((data) => {
        if (this.props.customerRetrieveMany.status !== 'SUCCESS') {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  customerModifyOne(customer) {
    this.props.customerModifyOneRequest(customer)
      .then((data) => {
        if (this.props.customerModifyOne.status === 'SUCCESS') {
          this.props.changePage('/customer');
          this.customerRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  customerCreateOne(customer) {
    this.props.customerCreateOneRequest(customer)
      .then((data) => {
        if (this.props.customerCreateOne.status === 'SUCCESS') {
          this.props.changePage('/customer');
          this.customerRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  customerRemoveOne(customer) {
    this.props.customerRemoveOneRequest(customer)
      .then((data) => {
        if (this.props.customerRemoveOne.status === 'SUCCESS') {
          this.props.changePage('/customer');
          this.customerRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  customerRemoveMany(customers) {
    this.props.customerRemoveManyRequest(customers)
      .then((data) => {
        if (this.props.customerRemoveMany.status === 'SUCCESS') {
          this.props.changePage('/customer');
          this.customerRetrieveMany();
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
        this.customerCreateOne(obj);
        break;
      case 'modifyOne':
        this.customerModifyOne(obj);
        break;
      case 'removeOne':
        this.customerRemoveOne(obj);
        break;
      case 'removeMany':
        this.customerRemoveMany(obj);
        break;
      default:
        break;
    }
  }
  render() {
    const {
      item, match, customerRetrieveMany, customerRetrieveOne, customerRetrieveOneRequest,
    } = this.props;
    const { structure } = this.state;
    const { objArr, objArrMap } = decompose(customerRetrieveMany.customers, structure);
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
              requestItem={customerRetrieveOneRequest}
              item={customerRetrieveOne.customer}
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
  customerRetrieveOne: state.admin.data.customer.retrieveOne,
  customerRetrieveMany: state.admin.data.customer.retrieveMany,
  customerModifyOne: state.admin.data.customer.modifyOne,
  customerCreateOne: state.admin.data.customer.createOne,
  customerRemoveOne: state.admin.data.customer.removeOne,
  customerRemoveMany: state.admin.data.customer.removeMany,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: path => push(path),
  noticeDialogOn: noticeDialogActions.on,
  noticeDialogOff: noticeDialogActions.off,
  showError: noticeDialogActions.error,
  customerRetrieveOneRequest: customerActions.retrieveOneRequest,
  customerRetrieveManyRequest: customerActions.retrieveManyRequest,
  customerModifyOneRequest: customerActions.modifyOneRequest,
  customerCreateOneRequest: customerActions.createOneRequest,
  customerRemoveOneRequest: customerActions.removeOneRequest,
  customerRemoveManyRequest: customerActions.removeManyRequest,
}, dispatch);
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Customer));
