import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import { push } from 'react-router-redux';
import { arrayMove } from 'react-sortable-hoc';
import * as noticeDialogActions from '../../../../data/noticeDialog/actions';
import * as productActions from '../../data/product/actions';
import MenuList from './components/MenuList';
import configure from '../../../../modules/configure';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
    this.onSortEnd = this.onSortEnd.bind(this);
    this.productRetrieveMany = this.productRetrieveMany.bind(this);
    this.productRetrieveOne = this.productRetrieveOne.bind(this);
    this.productRetrieveMany();
  }
  onSortEnd({ oldIndex, newIndex }) {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    });
  }
  productRetrieveOne(id) {
    this.props.productRetrieveOneRequest(id)
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
          this.setState((prevState) => {
            const { structure } = prevState;
            const { productRetrieveMany } = this.props;
            return {
              structure,
              items: productRetrieveMany.products,
            };
          });
        }
      })
      .catch((data) => {
        this.props.showError(data);
      });
  }
  render() {
    const {
      productRetrieveOne,
    } = this.props;
    let item;
    if (productRetrieveOne.status === 'SUCCESS') {
      item = JSON.parse(JSON.stringify(productRetrieveOne.product));
    }
    if (item && item.pictures) {
      item.pictures = item.pictures.map(src => `${configure.STATIC}${src}`);
    }
    return (
      <div>
        <MenuList
          list={JSON.parse(JSON.stringify(this.state.items)).map((item) => {
            const temp = item;
            if (temp.pictures) {
              temp.pictures = temp.pictures.map(src => `${configure.STATIC}${src}`);
            }
            return temp;
          })}
          onSortEnd={this.onSortEnd}
        />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  productRetrieveOne: state.admin.data.product.retrieveOne,
  productRetrieveMany: state.admin.data.product.retrieveMany,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: path => push(path),
  noticeDialogOn: noticeDialogActions.on,
  noticeDialogOff: noticeDialogActions.off,
  showError: noticeDialogActions.error,
  productRetrieveOneRequest: productActions.retrieveOneRequest,
  productRetrieveManyRequest: productActions.retrieveManyRequest,
}, dispatch);
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Menu));
