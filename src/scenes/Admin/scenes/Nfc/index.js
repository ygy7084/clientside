import React from 'react';
import {
  Route,
  withRouter,
  Switch,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import * as nfcActions from '../../data/nfc/actions';
import * as shopActions from '../../data/shop/actions';
import * as placeActions from '../../data/place/actions';
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
  },
  {
    name: '매장',
    key: ['shop', 'name'],
    type: 'string',
    form: 'autoSuggest',
    defaultValue: '',
    formOptions: [],
    formOptionsRestriction: true,
    filterTo: '장소',
    target: ['shop'],
  },
  {
    name: '장소',
    key: ['place', 'name'],
    type: 'string',
    form: 'selection',
    defaultValue: '',
    formOptions: [],
    formOptionsRestriction: true,
    filteredBy: '매장',
    target: ['place'],
  },
];
class Nfc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      structure: inputStructure,
    };
    this.nfcRetrieveMany = this.nfcRetrieveMany.bind(this);
    this.nfcModifyOne = this.nfcModifyOne.bind(this);
    this.nfcCreateOne = this.nfcCreateOne.bind(this);
    this.nfcRemoveOne = this.nfcRemoveOne.bind(this);
    this.nfcRemoveMany = this.nfcRemoveMany.bind(this);
    this.shopRetrieveMany = this.shopRetrieveMany.bind(this);
    this.handleClickItem = this.handleClickItem.bind(this);
    this.handleClickControls = this.handleClickControls.bind(this);
  }
  componentDidMount() {
    this.nfcRetrieveMany();
    this.shopRetrieveMany();
    this.placeRetrieveMany();
  }
  nfcRetrieveOne() {
    this.props.nfcRetrieveOneRequest()
      .then((data) => {
        if (this.props.nfcRetrieveOne.status === 'FAILURE') {
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
  nfcModifyOne(nfc) {
    this.props.nfcModifyOneRequest(nfc)
      .then((data) => {
        if (this.props.nfcModifyOne.status === 'SUCCESS') {
          this.props.changePage('/nfc');
          this.nfcRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  nfcCreateOne(nfc) {
    this.props.nfcCreateOneRequest(nfc)
      .then((data) => {
        if (this.props.nfcCreateOne.status === 'SUCCESS') {
          this.props.changePage('/nfc');
          this.nfcRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  nfcRemoveOne(nfc) {
    this.props.nfcRemoveOneRequest(nfc)
      .then((data) => {
        if (this.props.nfcRemoveOne.status === 'SUCCESS') {
          this.props.changePage('/nfc');
          this.nfcRetrieveMany();
        } else {
          throw data;
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  nfcRemoveMany(nfcs) {
    this.props.nfcRemoveManyRequest(nfcs)
      .then((data) => {
        if (this.props.nfcRemoveMany.status === 'SUCCESS') {
          this.props.changePage('/nfc');
          this.nfcRetrieveMany();
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
          this.setState((state) => {
            // const newS = state;
            const newS = JSON.parse(JSON.stringify(state));
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
  placeRetrieveMany() {
    this.props.placeRetrieveManyRequest()
      .then((data) => {
        if (this.props.placeRetrieveMany.status === 'SUCCESS') {
          this.setState((state) => {
            const newS = state;
            newS.structure.find(i => i.name === '장소').formOptions =
              this.props.placeRetrieveMany.places.map(place => ({
                label: place.name,
                value: place.name,
                filter: place.shop ? place.shop.name : undefined,
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
      const place = this.props.placeRetrieveMany.places.find(place => place.name === data.place);
      if (place) {
        obj.place = {
          _id: place._id,
          name: place.name,
        };
      } else {
        obj.place = null;
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
        this.nfcCreateOne(obj);
        break;
      case 'modifyOne':
        this.nfcModifyOne(obj);
        break;
      case 'removeOne':
        this.nfcRemoveOne(obj);
        break;
      case 'removeMany':
        this.nfcRemoveMany(obj);
        break;
      default:
        break;
    }
  }
  render() {
    const {
      item, match, nfcRetrieveMany, nfcRetrieveOne, nfcRetrieveOneRequest,
    } = this.props;
    const { structure } = this.state;
    const { objArr, objArrMap } = decompose(nfcRetrieveMany.nfcs, structure);
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
              requestItem={nfcRetrieveOneRequest}
              item={nfcRetrieveOne.nfc}
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
  nfcRetrieveOne: state.admin.data.nfc.retrieveOne,
  nfcRetrieveMany: state.admin.data.nfc.retrieveMany,
  nfcModifyOne: state.admin.data.nfc.modifyOne,
  nfcCreateOne: state.admin.data.nfc.createOne,
  nfcRemoveOne: state.admin.data.nfc.removeOne,
  nfcRemoveMany: state.admin.data.nfc.removeMany,
  shopRetrieveMany: state.admin.data.shop.retrieveMany,
  placeRetrieveMany: state.admin.data.place.retrieveMany,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: path => push(path),
  noticeDialogOn: noticeDialogActions.on,
  noticeDialogOff: noticeDialogActions.off,
  showError: noticeDialogActions.error,
  nfcRetrieveOneRequest: nfcActions.retrieveOneRequest,
  nfcRetrieveManyRequest: nfcActions.retrieveManyRequest,
  nfcModifyOneRequest: nfcActions.modifyOneRequest,
  nfcCreateOneRequest: nfcActions.createOneRequest,
  nfcRemoveOneRequest: nfcActions.removeOneRequest,
  nfcRemoveManyRequest: nfcActions.removeManyRequest,
  shopRetrieveManyRequest: shopActions.retrieveManyRequest,
  placeRetrieveManyRequest: placeActions.retrieveManyRequest,
}, dispatch);
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Nfc));
