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
import PlaceIcon from 'material-ui-icons/GetApp';
import MenuIcon from 'material-ui-icons/Apps';
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
import Picture from './scenes/Picture';
import Product from './scenes/Product';
import Customer from './scenes/Customer';
import Order from './scenes/Order';
import Nfc from './scenes/Nfc';
import Place from './scenes/Place';
import Log from './scenes/Log';
import Menu from './scenes/Menu';
import * as logoutActions from '../../data/logout/actions';
import * as authActions from '../../data/auth/actions';

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
    permission: ['manager', 'shop'],
    scene: Product,
  },
  {
    name: '고객',
    path: '/customer',
    icon: CustomerIcon,
    permission: ['manager', 'shop'],
    scene: Customer,
  },
  {
    name: '주문',
    path: '/order',
    icon: OrderIcon,
    permission: ['manager', 'shop'],
    scene: Order,
  },
  {
    name: 'NFC',
    path: '/nfc',
    icon: NfcIcon,
    permission: ['manager', 'shop'],
    scene: Nfc,
  },
  {
    name: '로그',
    path: '/log',
    icon: LogIcon,
    permission: ['manager', 'shop'],
    scene: Log,
  },
  {
    name: '이미지',
    path: '/picture',
    icon: PictureIcon,
    permission: ['manager', 'shop'],
    scene: Picture,
  },
  {
    name: '장소',
    path: '/place',
    icon: PlaceIcon,
    permission: ['manager', 'shop'],
    scene: Place,
  },
  {
    name: '메뉴판',
    path: '/menu',
    icon: MenuIcon,
    permission: ['manager', 'shop'],
    scene: Menu,

  }
];
class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickMenu = this.handleClickMenu.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
  }
  handleClickMenu(path) {
    this.props.changePage(`${path}`);
  }
  logoutHandler() {
    this.props.logoutRequest()
      .then((data) => {
        if (this.props.logout.status === 'SUCCESS') {
          this.props.authRequest();
        } else {
          throw data;
        }
      });
  }
  render() {
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
                  handleLogout={this.logoutHandler}
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
const mapStateToProps = state => ({
  logout: state.data.logout,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: path => push(path),
  logoutRequest: logoutActions.request,
  authRequest: authActions.request,
}, dispatch);
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Admin));
