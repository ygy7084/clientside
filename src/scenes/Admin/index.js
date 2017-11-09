import React from 'react';
import DashboardIcon from 'material-ui-icons/Home';
import AccountIcon from 'material-ui-icons/AccountBox';
import ShopIcon from 'material-ui-icons/Store';
import ProductIcon from 'material-ui-icons/LocalOffer';
import CustomerIcon from 'material-ui-icons/People';
import OrderIcon from 'material-ui-icons/ShoppingCart';
import NfcIcon from 'material-ui-icons/Nfc';
import LogIcon from 'material-ui-icons/History';
import PictureIcon from 'material-ui-icons/Photo';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import Home from './components/Home';
import Dashboard from './scenes/Dashboard';
import Account from './scenes/Account';
import Shop from './scenes/Shop';

const menuItems = [
  {
    name: '홈',
    path: '/',
    exact: true,
    icon: DashboardIcon,
    permission: ['manager', 'shop'],
    scene: Dashboard,
  },
  {
    name: '계정',
    path: '/account',
    icon: AccountIcon,
    permission: ['manager', 'shop'],
    scene: Account,
  },
  {
    name: '매장',
    path: '/shop',
    icon: ShopIcon,
    permission: ['manager', 'shop'],
    scene: Shop,
  },
  {
    name: '상품',
    path: '/product',
    icon: ProductIcon,
    permission: ['manager', 'shop']
  },
  {
    name: '고객',
    path: '/customer',
    icon: CustomerIcon,
    permission: ['manager', 'shop']
  },
  {
    name: '주문',
    path: '/order',
    icon: OrderIcon,
    permission: ['manager', 'shop']
  },
  {
    name: 'NFC',
    path: '/nfc',
    icon: NfcIcon,
    permission: ['manager', 'shop']
  },
  {
    name: '로그',
    path: '/log',
    icon: LogIcon,
    permission: ['manager', 'shop']
  },
  {
    name: '이미지',
    path: '/picture',
    icon: PictureIcon,
    permission: ['manager', 'shop']
  },
];
class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickMenu = this.handleClickMenu.bind(this);
  }
  handleClickMenu(path) {
    this.props.changePage(`${path}`);
  }
  render() {
    const routes = [];
    menuItems.forEach(item => routes.push(
      <Route
        key={item.path}
        path={item.path}
        render={() => (<div>{item.name}</div>)}
      />
    ));
    return (
      <Switch>
        {
          menuItems.map(Item => (
            <Route
              key={Item.path}
              path={Item.path}
              exact={Item.exact}
              render={props => (
                <Home
                  {...props}
                  user={this.props.user}
                  appTitle="Manager System"
                  selectedMenuItem={Item}
                  menuItems={menuItems}
                  onMenuClick={this.handleClickMenu}
                >
                  <Item.scene
                    {...props}
                    item={Item}
                  />
                </Home>
              )}
            />
          ))
        }
      </Switch>
    );
  }
}
const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: path => push(path),
}, dispatch);
export default withRouter(connect(
  null,
  mapDispatchToProps,
)(Admin));
