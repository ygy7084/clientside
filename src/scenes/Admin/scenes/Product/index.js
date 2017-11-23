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
import * as productActions from '../../data/product/actions';
import * as pictureActions from '../../data/picture/actions';
import * as noticeDialogActions from '../../../../data/noticeDialog/actions';
import { decompose } from '../../modules';
import AdminTable from '../../components/AdminTable';
import Dialog from '../../components/Dialog';
import configure from '../../../../modules/configure';

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
    name: '이름',
    key: ['name'],
    type: 'string',
    target: ['name'],
    required: true,
  },
  {
    name: '간단 설명',
    key: ['subDescription'],
    type: 'string',
    target: ['subDescription'],
  },
  {
    name: '설명',
    key: ['description'],
    tableView: false,
    type: 'string',
    multiline: true,
    target: ['description'],
  },
  {
    name: '가격',
    key: ['price'],
    type: 'number',
    target: ['price'],
  },
  {
    name: '종류',
    key: ['category'],
    type: 'string',
    form: 'autoSuggest',
    defaultValue: '',
    formOptions: [],
    target: ['category'],
  },
  {
    name: '매장',
    key: ['shop', 'name'],
    type: 'string',
    form: 'autoSuggest',
    defaultValue: '',
    formOptions: [],
    formOptionsRestriction: true,
    target: ['shop'],
  },
  {
    name: '사진 개수',
    key: ['pictures'],
    type: 'array',
    defaultValue: [],
    tableFunc: arr => arr.length,
    form: 'pictures',
    formOptions: [],
    target: ['pictures'],
    readOnly: true,
  },
];
class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      structure: inputStructure,
    };
    this.shopRetrieveMany = this.shopRetrieveMany.bind(this);
    this.pictureRetrieveMany = this.pictureRetrieveMany.bind(this);
    this.productRetrieveMany = this.productRetrieveMany.bind(this);
    this.productRetrieveOne = this.productRetrieveOne.bind(this);
    this.productModifyOne = this.productModifyOne.bind(this);
    this.productCreateOne = this.productCreateOne.bind(this);
    this.productRemoveOne = this.productRemoveOne.bind(this);
    this.productRemoveMany = this.productRemoveMany.bind(this);
    this.handleClickItem = this.handleClickItem.bind(this);
    this.handleClickControls = this.handleClickControls.bind(this);
  }
  componentDidMount() {
    this.productRetrieveMany();
    this.shopRetrieveMany();
    this.pictureRetrieveMany();
  }
  shopRetrieveMany() {
    this.props.shopRetrieveManyRequest()
      .then((data) => {
        if (this.props.shopRetrieveMany.status === 'SUCCESS') {
          this.setState((state) => {
            const newS = state;
            newS.structure.find(i => i.name === '매장').formOptions =
              this.props.shopRetrieveMany.shops.map(shop => ({
                label: shop.name,
                value: shop.name,
              }));
            return newS;
          });
        } else {
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
        } else {
          this.setState((prevState) => {
            const { structure } = prevState;
            structure.find(i => i.name === '사진 개수').formOptions =
              this.props.pictureRetrieveMany.pictures.map(({ path, fileName }) =>
                `${configure.SERVER}${path}/${fileName}?${new Date().getTime()}`
              );
            return { structure };
          });
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  productRetrieveOne() {
    this.props.productRetrieveOneRequest()
      .then((data) => {
        if (this.props.productRetrieveOne.status === 'FAILURE') {
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
        } else {
          this.setState((state) => {
            const newS = state;
            const arr = [];
            this.props.productRetrieveMany.products.forEach((item) => {
              if (item.category && item.category !== '' && arr.findIndex(o => o === item.category) < 0) {
                arr.push(item.category);
              }
            });
            newS.structure.find(i => i.name === '종류').formOptions =
              arr.map(o => ({
                label: o,
                value: o,
              }));
            return newS;
          });
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  productModifyOne(product) {
    this.props.productModifyOneRequest(product)
      .then((data) => {
        if (this.props.productModifyOne.status === 'SUCCESS') {
          this.props.changePage('/product');
          this.productRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  productCreateOne(product) {
    this.props.productCreateOneRequest(product)
      .then((data) => {
        if (this.props.productCreateOne.status === 'SUCCESS') {
          this.props.changePage('/product');
          this.productRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  productRemoveOne(product) {
    this.props.productRemoveOneRequest(product)
      .then((data) => {
        if (this.props.productRemoveOne.status === 'SUCCESS') {
          this.props.changePage('/product');
          this.productRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  productRemoveMany(products) {
    this.props.productRemoveManyRequest(products)
      .then((data) => {
        if (this.props.productRemoveMany.status === 'SUCCESS') {
          this.props.changePage('/product');
          this.productRetrieveMany();
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
      const shop = this.props.shopRetrieveMany.shops.find(shop => shop.name === data.shop);
      if (shop) {
        obj.shop = {
          _id: shop._id,
          name: shop.name,
        };
      } else {
        obj.shop = null;
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
        this.productCreateOne(obj);
        break;
      case 'modifyOne':
        this.productModifyOne(obj);
        break;
      case 'removeOne':
        this.productRemoveOne(obj);
        break;
      case 'removeMany':
        this.productRemoveMany(obj);
        break;
      default:
        break;
    }
  }
  render() {
    const {
      item, match, productRetrieveMany, productRetrieveOne, productRetrieveOneRequest,
    } = this.props;
    const { structure } = this.state;
    const { objArr, objArrMap } = decompose(productRetrieveMany.products, structure);
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
              requestItem={productRetrieveOneRequest}
              item={productRetrieveOne.product}
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
  shopRetrieveMany: state.admin.data.shop.retrieveMany,
  pictureRetrieveMany: state.admin.data.picture.retrieveMany,
  productRetrieveOne: state.admin.data.product.retrieveOne,
  productRetrieveMany: state.admin.data.product.retrieveMany,
  productModifyOne: state.admin.data.product.modifyOne,
  productCreateOne: state.admin.data.product.createOne,
  productRemoveOne: state.admin.data.product.removeOne,
  productRemoveMany: state.admin.data.product.removeMany,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: path => push(path),
  noticeDialogOn: noticeDialogActions.on,
  noticeDialogOff: noticeDialogActions.off,
  showError: noticeDialogActions.error,
  shopRetrieveManyRequest: shopActions.retrieveManyRequest,
  pictureRetrieveManyRequest: pictureActions.retrieveManyRequest,
  productRetrieveOneRequest: productActions.retrieveOneRequest,
  productRetrieveManyRequest: productActions.retrieveManyRequest,
  productModifyOneRequest: productActions.modifyOneRequest,
  productCreateOneRequest: productActions.createOneRequest,
  productRemoveOneRequest: productActions.removeOneRequest,
  productRemoveManyRequest: productActions.removeManyRequest,
}, dispatch);
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Product));
