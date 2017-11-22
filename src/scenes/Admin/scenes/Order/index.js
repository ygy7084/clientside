import React from 'react';
import {
  Route,
  withRouter,
  Switch,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import * as orderActions from '../../data/order/actions';
import * as shopActions from '../../data/shop/actions';
import * as customerActions from '../../data/customer/actions';
import * as productActions from '../../data/product/actions';
import * as nfcActions from '../../data/nfc/actions';
import * as placeActions from '../../data/place/actions';
import * as noticeDialogActions from '../../../../data/noticeDialog/actions';
import { decompose } from '../../modules';
import AdminTable from '../../components/AdminTable';
import Dialog from './components/Dialog';

const inputStructure = [
  {
    name: '_id',
    key: ['_id'],
    type: 'string',
    tableOptions: ['disablePadding'],
  },
  {
    name: '매장',
    key: ['shop', 'name'],
    type: 'string',
  },
  {
    name: '고객',
    key: ['customer'],
    type: 'object',
    form: 'customer',
    tableView: false,
    target: ['customer'],
  },
  {
    name: '시각',
    key: ['datetime'],
    type: 'date',
    tableFunc: (o) => new Date(o).toLocaleString(),
  },
  {
    name: '상태',
    key: ['status'],
    type: 'number',
  },
];
class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      structure: inputStructure,
    };
    this.shopRetrieveMany = this.shopRetrieveMany.bind(this);
    this.productRetrieveMany = this.productRetrieveMany.bind(this);
    this.placeRetrieveMany = this.placeRetrieveMany.bind(this);
    this.nfcRetrieveMany = this.nfcRetrieveMany.bind(this);
    this.customerRetrieveMany = this.customerRetrieveMany.bind(this);
    this.orderRetrieveOne = this.orderRetrieveOne.bind(this);
    this.orderRetrieveMany = this.orderRetrieveMany.bind(this);
    this.orderModifyOne = this.orderModifyOne.bind(this);
    this.orderCreateOne = this.orderCreateOne.bind(this);
    this.orderRemoveOne = this.orderRemoveOne.bind(this);
    this.orderRemoveMany = this.orderRemoveMany.bind(this);
    this.handleClickItem = this.handleClickItem.bind(this);
    this.handleClickControls = this.handleClickControls.bind(this);
  }
  componentDidMount() {
    this.shopRetrieveMany();
    this.productRetrieveMany();
    this.placeRetrieveMany();
    this.nfcRetrieveMany();
    this.customerRetrieveMany();
    this.orderRetrieveMany();
  }
  shopRetrieveMany() {
    this.props.shopRetrieveManyRequest()
      .then((data) => {
        if (this.props.shopRetrieveMany.status === 'FAILURE') {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  productRetrieveMany() {
    this.props.productRetrieveManyRequest()
      .then((data) => {
        if (this.props.productRetrieveMany.status === 'FAILURE') {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  placeRetrieveMany() {
    this.props.placeRetrieveManyRequest()
      .then((data) => {
        if (this.props.placeRetrieveMany.status === 'FAILURE') {
          console.log(this.props);
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  nfcRetrieveMany() {
    this.props.nfcRetrieveManyRequest()
      .then((data) => {
        if (this.props.nfcRetrieveMany.status === 'FAILURE') {
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
        if (this.props.customerRetrieveMany.status === 'FAILURE') {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  orderRetrieveOne() {
    this.props.orderRetrieveOneRequest()
      .then((data) => {
        if (this.props.orderRetrieveOne.status === 'FAILURE') {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  orderRetrieveMany() {
    this.props.orderRetrieveManyRequest()
      .then((data) => {
        if (this.props.orderRetrieveMany.status === 'FAILURE') {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  orderModifyOne(order) {
    this.props.orderModifyOneRequest(order)
      .then((data) => {
        if (this.props.orderModifyOne.status === 'SUCCESS') {
          this.props.changePage('/order');
          this.orderRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  orderCreateOne(order) {
    this.props.orderCreateOneRequest(order)
      .then((data) => {
        if (this.props.orderCreateOne.status === 'SUCCESS') {
          this.props.changePage('/order');
          this.orderRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  orderRemoveOne(order) {
    this.props.orderRemoveOneRequest(order)
      .then((data) => {
        if (this.props.orderRemoveOne.status === 'SUCCESS') {
          this.props.changePage('/order');
          this.orderRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  orderRemoveMany(orders) {
    this.props.orderRemoveManyRequest(orders)
      .then((data) => {
        if (this.props.orderRemoveMany.status === 'SUCCESS') {
          this.props.changePage('/order');
          this.orderRetrieveMany();
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
        this.orderCreateOne(obj);
        break;
      case 'modifyOne':
        this.orderModifyOne(obj);
        break;
      case 'removeOne':
        this.orderRemoveOne(obj);
        break;
      case 'removeMany':
        this.orderRemoveMany(obj);
        break;
      default:
        break;
    }
  }
  render() {
    const {
      item, match, orderRetrieveMany, orderRetrieveOne, orderRetrieveOneRequest,
    } = this.props;
    const { structure } = this.state;
    const { objArr, objArrMap } = decompose(orderRetrieveMany.orders, structure);
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
              actions={{
                shopRetrieveMany: this.shopRetrieveMany,
                productRetrieveMany: this.productRetrieveMany,
                placeRetrieveMany: this.placeRetrieveMany,
                nfcRetrieveMany: this.nfcRetrieveMany,
                customerRetrieveMany: this.customerRetrieveMany,
              }}
              data={{
                shops: this.props.shopRetrieveMany.shops,
                products: this.props.productRetrieveMany.products,
                places: this.props.placeRetrieveMany.places,
                nfcs: this.props.nfcRetrieveMany.nfcs,
                customers: this.props.customerRetrieveMany.customers,
              }}
            />
          )}
        />
        <Route
          path={`${match.url}/:id`}
          render={({ match }) => (
            <Dialog
              title={`${item.name} 수정`}
              itemStructure={structure}
              requestItem={orderRetrieveOneRequest}
              item={orderRetrieveOne.order}
              match={match}
              handleClickControls={this.handleClickControls}
              mode="modify"
              actions={{
                shopRetrieveMany: this.shopRetrieveMany,
                productRetrieveMany: this.productRetrieveMany,
                placeRetrieveMany: this.placeRetrieveMany,
                nfcRetrieveMany: this.nfcRetrieveMany,
                customerRetrieveMany: this.customerRetrieveMany,
              }}
              data={{
                shops: this.props.shopRetrieveMany.shops,
                products: this.props.productRetrieveMany.products,
                places: this.props.placeRetrieveMany.places,
                nfcs: this.props.nfcRetrieveMany.nfcs,
                customers: this.props.customerRetrieveMany.customers,
              }}
            />
          )}
        />
      </Switch>
    );
  }
}
const mapStateToProps = state => ({
  shopRetrieveMany: state.admin.data.shop.retrieveMany,
  productRetrieveMany: state.admin.data.product.retrieveMany,
  placeRetrieveMany: state.admin.data.place.retrieveMany,
  nfcRetrieveMany: state.admin.data.nfc.retrieveMany,
  customerRetrieveMany: state.admin.data.customer.retrieveMany,
  orderRetrieveOne: state.admin.data.order.retrieveOne,
  orderRetrieveMany: state.admin.data.order.retrieveMany,
  orderModifyOne: state.admin.data.order.modifyOne,
  orderCreateOne: state.admin.data.order.createOne,
  orderRemoveOne: state.admin.data.order.removeOne,
  orderRemoveMany: state.admin.data.order.removeMany,
  state
});
const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: path => push(path),
  noticeDialogOn: noticeDialogActions.on,
  noticeDialogOff: noticeDialogActions.off,
  showError: noticeDialogActions.error,
  shopRetrieveManyRequest: shopActions.retrieveManyRequest,
  productRetrieveManyRequest: productActions.retrieveManyRequest,
  placeRetrieveManyRequest: placeActions.retrieveManyRequest,
  nfcRetrieveManyRequest: nfcActions.retrieveManyRequest,
  customerRetrieveManyRequest: customerActions.retrieveManyRequest,
  orderRetrieveOneRequest: orderActions.retrieveOneRequest,
  orderRetrieveManyRequest: orderActions.retrieveManyRequest,
  orderModifyOneRequest: orderActions.modifyOneRequest,
  orderCreateOneRequest: orderActions.createOneRequest,
  orderRemoveOneRequest: orderActions.removeOneRequest,
  orderRemoveManyRequest: orderActions.removeManyRequest,
}, dispatch);
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Order));
