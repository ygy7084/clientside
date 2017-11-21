/* global FileReader */
import React from 'react';
import _ from 'lodash';
import Paper from 'material-ui/Paper';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/Menu/MenuItem';
import { withStyles } from 'material-ui/styles';
import FileUpload from 'material-ui-icons/FileUpload';
import Button from 'material-ui/Button';
import ControlPanel from '../ControlPanel';
import AutoSuggestion from '../AutoSuggestion';
import configure from '../../../../modules/configure';

import './styles.css';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit,
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
  fileInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
});
function isError(obj, value) {
  let r =
    obj.formOptionsRestriction === true
    && value !== undefined
    && value !== null
    && obj.formOptions.findIndex(o => o.value === obj.value) < 0;
  if (value === '') {
    r = !!obj.required;
  }
  return r;
}
function initialize(structure, item) {
  const newArr = [];
  structure.forEach((o) => {
    const obj = o;
    let value;
    if (item) {
      value = _.get(item, o.key);
    } else {
      value = o.defaultValue || '';
    }
    obj.value = value;
    obj.error = isError(o, value);
    newArr.push(obj);
  });
  return newArr;
}
class ImageInputDialog extends React.Component {
  constructor(props) {
    super(props);
    const initState = initialize(props.itemStructure, props.item);
    let pictureUrl = '';
    if (props.mode === 'modify') {
      const fileName = initState.find(o => o.name === 'fileName').value;
      const path = initState.find(o => o.name === 'path').value;
      pictureUrl = `${configure.SERVER}${path}/${fileName}?${new Date().getTime()}`;
    }
    this.state = {
      inputs: initState,
      file: '',
      pictureUrl,
      pictureChanged: props.mode === 'create' ? undefined : false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClickControls = this.handleClickControls.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }
  componentDidMount() {
    if (this.props.mode === 'modify') {
      this.props.requestItem(this.props.match.params.id);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      const initState = initialize(nextProps.itemStructure, nextProps.item);
      let pictureUrl = '';
      if (this.props.mode === 'modify') {
        const fileName = initState.find(o => o.name === 'fileName').value;
        const path = initState.find(o => o.name === 'path').value;
        pictureUrl = `${configure.SERVER}${path}/${fileName}?${new Date().getTime()}`;
      }
      this.setState({
        inputs: initState,
        pictureUrl,
      });
    }
  }
  handleInputChange(value, key) {
    this.setState((prevState) => {
      const prevInputs = JSON.parse(JSON.stringify(prevState.inputs));
      const found = prevInputs.find(o => o.name === key);
      found.value = value;
      found.error = isError(found, value);
      return { inputs: prevInputs };
    });
  }
  handleClickControls(clicked) {
    const result = {};
    this.state.inputs.forEach(o =>
      _.set(result, o.target, o.value)
    );
    let f;
    if ((this.props.mode === 'create' && this.state.file) ||
      (this.props.mode === 'modify' && this.state.pictureChanged)) {
      const { file } = this.state;
      f = file;
    }
    switch (clicked) {
      default:
        this.props.handleClickControls(clicked, result, f);
        break;
    }
  }
  handleImageChange(e) {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    if (file) {
      reader.onloadend = () => {
        this.setState({
          file,
          pictureUrl: reader.result,
          pictureChanged: this.props.mode === 'modify' ? true : undefined,
        });
      };
      reader.readAsDataURL(file);
    }
  }
  render() {
    const {
      classes, title, item, mode
    } = this.props;
    const inputs = [];
    this.state.inputs.forEach((i) => {
      if (!i.form) {
        inputs.push(
          <TextField
            key={i.name}
            id={i.name}
            label={i.name}
            type={i.type === 'number' ? 'number' : undefined}
            className={classes.formInput}
            fullWidth
            value={!item && i.value === '' ? i.defaultValue || '' : i.value || ''}
            disabled={i.readOnly}
            onChange={e => this.handleInputChange(e.target.value, i.name)}
          />
        );
      } else if (i.form === 'selection') {
        inputs.push(
          <TextField
            key={i.name}
            id={i.name}
            label={i.name}
            select
            className={classes.formInput}
            fullWidth
            value={!item && i.value === '' ? i.defaultValue : i.value ? i.value : ''}
            disabled={i.readOnly}
            onChange={e => this.handleInputChange(e.target.value, i.name)}
          >
            {
              i.formOptions.map(option => (
                <MenuItem key={`${option.label}`} value={option.value}>
                  {option.label}
                </MenuItem>
              ))
            }
          </TextField>
        );
      } else if (i.form === 'autoSuggest') {
        inputs.push(
          <AutoSuggestion
            key={i.name}
            id={i.name}
            label={i.name}
            className={classes.formInput}
            suggestions={i.formOptions}
            onChange={value => this.handleInputChange(value, i.name)}
            value={!item && i.value === '' ? i.defaultValue : i.value ? i.value : ''}
            error={i.error}
          />);
      }
      inputs.push(<br key={`${i.name}br`} />);
    });
    return (
      <div>
        <ControlPanel
          handleClickControls={this.handleClickControls}
          noRemove={!item}
          mode={mode}
          cannotSave={this.state.file === '' || (mode === 'modify' && !this.state.pictureChanged)}
        />
        <Paper className={classes.root}>
          <Toolbar className={classes.toolbar}>
            <div className={classes.title}>
              <Typography type="title">{title}</Typography>
            </div>
          </Toolbar>
          <form className={classes.form}>
            {inputs}
            <Button raised className={classes.formInput}>
              Upload
              <input
                type="file"
                className={classes.fileInput}
                onChange={this.handleImageChange}
              />
              <FileUpload />
            </Button>
            {
              this.state.pictureUrl !== '' ?
                <img alt="anImage" className="anImage" src={this.state.pictureUrl} /> : null
            }
          </form>
        </Paper>
      </div>
    );
  }
}
export default withStyles(styles)(ImageInputDialog);
