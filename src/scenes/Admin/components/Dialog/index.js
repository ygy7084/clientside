import React from 'react';
import _ from 'lodash';
import Paper from 'material-ui/Paper';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/Menu/MenuItem';
import { withStyles } from 'material-ui/styles';
import ControlPanel from '../ControlPanel';
import AutoSuggestion from '../AutoSuggestion';

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
  structure.forEach((o) => {
    let value;
    if (item) {
      value = _.get(item, o.key);
    } else {
      value = o.defaultValue || '';
    }
    o.value = value;
    o.error = isError(o, value);
  });
  return structure;
}
class Dialog extends React.Component {
  constructor(props) {
    super(props);
    const initState = initialize(props.itemStructure, props.item);
    this.state = {
      inputs: initState,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClickControls = this.handleClickControls.bind(this);
  }
  componentDidMount() {
    if (this.props.mode === 'modify') {
      this.props.requestItem(this.props.match.params.id);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      const initState = initialize(nextProps.itemStructure, nextProps.item);
      this.setState({
        inputs: initState,
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
    switch (clicked) {
      default:
        this.props.handleClickControls(clicked, result);
        break;
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
          cannotSave={this.state.inputs.map(o => o.error).reduce((a, c) => {
            return !!(a || c);
          })}
        />
        <Paper className={classes.root}>
          <Toolbar className={classes.toolbar}>
            <div className={classes.title}>
              <Typography type="title">{title}</Typography>
            </div>
          </Toolbar>
          <form className={classes.form}>
            { inputs }
          </form>
        </Paper>
      </div>
    );
  }
}
export default withStyles(styles)(Dialog);
