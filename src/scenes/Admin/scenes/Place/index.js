import React from 'react';
import {
  Route,
  withRouter,
  Switch,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import * as placeActions from '../../data/place/actions';
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
    name: '이름',
    key: ['name'],
    type: 'string',
    target: ['name'],
    required: true,
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
    required: true,
  },
];
class Place extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      structure: inputStructure,
    };
    this.placeRetrieveMany = this.placeRetrieveMany.bind(this);
    this.placeModifyOne = this.placeModifyOne.bind(this);
    this.placeCreateOne = this.placeCreateOne.bind(this);
    this.placeRemoveOne = this.placeRemoveOne.bind(this);
    this.placeRemoveMany = this.placeRemoveMany.bind(this);
    this.shopRetrieveMany = this.shopRetrieveMany.bind(this);
    this.handleClickItem = this.handleClickItem.bind(this);
    this.handleClickControls = this.handleClickControls.bind(this);
  }
  componentDidMount() {
    this.placeRetrieveMany();
    this.shopRetrieveMany();
  }
  placeRetrieveOne() {
    this.props.placeRetrieveOneRequest()
      .then((data) => {
        if (this.props.placeRetrieveOne.status === 'FAILURE') {
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
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  placeModifyOne(place) {
    this.props.placeModifyOneRequest(place)
      .then((data) => {
        if (this.props.placeModifyOne.status === 'SUCCESS') {
          this.props.changePage('/place');
          this.placeRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  placeCreateOne(place) {
    this.props.placeCreateOneRequest(place)
      .then((data) => {
        if (this.props.placeCreateOne.status === 'SUCCESS') {
          this.props.changePage('/place');
          this.placeRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  placeRemoveOne(place) {
    this.props.placeRemoveOneRequest(place)
      .then((data) => {
        if (this.props.placeRemoveOne.status === 'SUCCESS') {
          this.props.changePage('/place');
          this.placeRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  placeRemoveMany(places) {
    this.props.placeRemoveManyRequest(places)
      .then((data) => {
        if (this.props.placeRemoveMany.status === 'SUCCESS') {
          this.props.changePage('/place');
          this.placeRetrieveMany();
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
          newState.structure.find(i => i.name === '매장').formOptions =
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
        this.placeCreateOne(obj);
        break;
      case 'modifyOne':
        this.placeModifyOne(obj);
        break;
      case 'removeOne':
        this.placeRemoveOne(obj);
        break;
      case 'removeMany':
        this.placeRemoveMany(obj);
        break;
      default:
        break;
    }
  }
  render() {
    const {
      item, match, placeRetrieveMany, placeRetrieveOne, placeRetrieveOneRequest,
    } = this.props;
    const { structure } = this.state;
    const { objArr, objArrMap } = decompose(placeRetrieveMany.places, structure);
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
              requestItem={placeRetrieveOneRequest}
              item={placeRetrieveOne.place}
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
  placeRetrieveOne: state.admin.data.place.retrieveOne,
  placeRetrieveMany: state.admin.data.place.retrieveMany,
  placeModifyOne: state.admin.data.place.modifyOne,
  placeCreateOne: state.admin.data.place.createOne,
  placeRemoveOne: state.admin.data.place.removeOne,
  placeRemoveMany: state.admin.data.place.removeMany,
  shopRetrieveMany: state.admin.data.shop.retrieveMany,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: path => push(path),
  noticeDialogOn: noticeDialogActions.on,
  noticeDialogOff: noticeDialogActions.off,
  showError: noticeDialogActions.error,
  placeRetrieveOneRequest: placeActions.retrieveOneRequest,
  placeRetrieveManyRequest: placeActions.retrieveManyRequest,
  placeModifyOneRequest: placeActions.modifyOneRequest,
  placeCreateOneRequest: placeActions.createOneRequest,
  placeRemoveOneRequest: placeActions.removeOneRequest,
  placeRemoveManyRequest: placeActions.removeManyRequest,
  shopRetrieveManyRequest: shopActions.retrieveManyRequest,
}, dispatch);
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Place));
