import React from 'react';
import _ from 'lodash';
import Paper from 'material-ui/Paper';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/Menu/MenuItem';
import { withStyles } from 'material-ui/styles';
import ControlPanel from '../../../../components/ControlPanel';
import AutoSuggestion from '../../../../components/AutoSuggestion';
import './styles.css';

const drawerWidth = 240;
const styles = theme => ({
  root: {
    position: 'absolute',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  toolbar: {
    paddingRight: 2,
  },
  title: {
    flex: '0 0 auto',
  },
  form: {
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
  },
  formInput: {
    marginBottom: theme.spacing.unit,
  },
  imgAddButton: {
    margin: theme.spacing.unit,
  },
});
class Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shop: {},
      products: [],
      customer: {},
      nfc: {},
      place: {},
      datetime: undefined,
      message: '',
      status: 0,
    };
    if (this.props.item) {
      this.state = {
        shop: this.props.item.shop || {},
        products: this.props.item.products || [],
        customer: this.props.item.customer || {},
        nfc: this.props.item.nfc || {},
        place: this.props.item.place || {},
        datetime: this.props.item.datetime || null,
        message: this.props.item.message || '',
        status: this.props.item.status || 0,
      };
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClickControls = this.handleClickControls.bind(this);
  }
  componentDidMount() {
    if (this.props.mode === 'modify') {
      this.props.requestItem(this.props.match.params.id);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.item) {
      this.setState({
        shop: nextProps.item.shop || {},
        products: nextProps.item.products || [],
        customer: nextProps.item.customer || {},
        nfc: nextProps.item.nfc || {},
        place: nextProps.item.place || {},
        datetime: nextProps.item.datetime || null,
        message: nextProps.item.message || '',
        status: nextProps.item.status || 0,
      });
    }
  }
  handleInputChange(value, key) {
    if (key === 'shop') {
      const shop = this.props.data.shops.find(o => o.name === value);
      this.setState({
        shop:
          { _id: shop ? shop._id : '', name: value } });
    } else if (key === 'customer') {
      const customer = this.props.data.customers.find(o => o.name === value);
      this.setState({
        customer:
          { _id: customer ? customer._id : '', name: value },
      });
    } else if (key === 'nfc') {
      const nfc = this.props.data.nfcs.find(o => o.name === value);
      this.setState({
        nfc:
          { _id: nfc ? nfc._id : '', name: value },
      });
    } else if (key === 'place') {
      const place = this.props.data.places.find(o => o.name === value);
      this.setState({
        place:
          { _id: place ? place._id : '', name: value },
      });
    } else if (key === 'status') {
      this.setState({
        status: value,
      });
    }
  }
  handleClickControls(clicked) {
    let result = {};
    switch (clicked) {
      default:
        result = this.state;
        if (this.props.item) {
          result._id = this.props.item._id;
        } else {
          result.datetime = new Date();
        }
        this.props.handleClickControls(clicked, result);
        break;
    }
  }
  render() {
    const {
      classes, title, item, mode, data
    } = this.props;
    return (
      <div>
        <ControlPanel
          handleClickControls={this.handleClickControls}
          noRemove={!item}
          mode={mode}
          cannotSave={false}
        />
        <Paper className={classes.root}>
          <Toolbar className={classes.toolbar}>
            <div className={classes.title}>
              <Typography type="title">{title}</Typography>
            </div>
          </Toolbar>
          <form className={classes.form}>
            <div>
              <h4>상태</h4>
              <TextField
                label="상태"
                select
                className={classes.formInput}
                fullWidth
                value={this.state.status}
                onChange={e => this.handleInputChange(e.target.value, "status")}
              >
                <MenuItem value={0}>
                  주문됨
                </MenuItem>
                <MenuItem value={1}>
                  배송 완료
                </MenuItem>
                <MenuItem value={2}>
                  취소됨
                </MenuItem>
              </TextField>
              <h4>매장</h4>
              <TextField
                label="매장 _id"
                className={classes.formInput}
                fullWidth
                value={this.state.shop._id || ''}
                disabled
              />
              <AutoSuggestion
                label="매장 이름"
                className={classes.formInput}
                suggestions={data && data.shops ? data.shops.map(shop => ({
                  label: shop.name,
                  value: shop._id,
                })) : []}
                onChange={value => this.handleInputChange(value, 'shop')}
                value={this.state.shop.name || ''}
              />
            </div>
            <div>
              <h4>고객</h4>
              <TextField
                label="고객 _id"
                className={classes.formInput}
                fullWidth
                value={this.state.customer._id || ''}
                disabled
              />
              <AutoSuggestion
                label="고객 이름"
                className={classes.formInput}
                suggestions={data && data.customers ? data.customers.map(customer => ({
                  label: customer.name,
                  value: customer._id,
                })) : []}
                onChange={value => this.handleInputChange(value, 'customer')}
                value={this.state.customer.name || ''}
              />
            </div>
            <div>
              <h4>상품</h4>
              {
                this.state.products && this.state.products.length ?
                  this.state.products.map(o =>
                    <p key={o.name}>{o.name}</p>
                  ) : null
              }
            </div>
            <div>
              <h4>NFC</h4>
              <TextField
                label="NFC _id"
                className={classes.formInput}
                fullWidth
                value={this.state.nfc._id || ''}
                disabled
              />
              <AutoSuggestion
                label="NFC"
                className={classes.formInput}
                suggestions={data && data.nfcs ? data.nfcs.map(nfc => ({
                  label: nfc.name,
                  value: nfc._id,
                })) : []}
                onChange={value => this.handleInputChange(value, 'nfc')}
                value={this.state.nfc.name || ''}
              />
            </div>
            <div>
              <h4>장소</h4>
              <TextField
                label="장소 _id"
                className={classes.formInput}
                fullWidth
                value={this.state.place._id || ''}
                disabled
              />
              <AutoSuggestion
                label="장소 이름"
                className={classes.formInput}
                suggestions={data && data.places ? data.places.map(place => ({
                  label: place.name,
                  value: place._id,
                })) : []}
                onChange={value => this.handleInputChange(value, 'place')}
                value={this.state.place.name || ''}
              />
            </div>
            <div>
              <h4>시각</h4>
              <TextField
                label="시각"
                className={classes.formInput}
                fullWidth
                value={this.state.datetime ? new Date(this.state.datetime).toLocaleString() : ''}
                disabled
              />
            </div>
          </form>
        </Paper>
      </div>
    );
  }
}
export default withStyles(styles)(Dialog);
