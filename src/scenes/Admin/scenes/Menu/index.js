import React from 'react';
import {
  Route,
  withRouter,
  Switch,
  render,
} from 'react-router-dom';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import * as productActions from '../../data/product/actions';
import * as noticeDialogActions from '../../../../data/noticeDialog/actions';

const SortableItem = SortableElement(({value}) =>
  <div style={{ border: '1px solid black'}}><p>{value}</p></div>
);
const SortableList = SortableContainer(({items}) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </ul>
  );
});

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
    this.props.productRetrieveManyRequest()
      .then((data) => {
        if(this.props.productRetrieveMany.status === 'FAILURE') {
          throw data;
        }
      });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      items: nextProps.productRetrieveMany.products.map(i => i.name),
    });
  }
  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    });
  };
  render() {
    return <SortableList items={this.state.items} onSortEnd={this.onSortEnd} />;
  }
}
const mapStateToProps = state => ({
  productRetrieveMany: state.admin.data.product.retrieveMany,
 });
const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: path => push(path),
  noticeDialogOn: noticeDialogActions.on,
  noticeDialogOff: noticeDialogActions.off,
  showError: noticeDialogActions.error,
  productRetrieveManyRequest: productActions.retrieveManyRequest,
  }, dispatch);
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Menu));