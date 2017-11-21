import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import './styles.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputId: '',
      inputPassword: '',
    };
    this.onInputChange = this.onInputChange.bind(this);
  }
  onInputChange(name) {
    return event =>
      this.setState({
        [name]: event.target.value,
      });
  }
  render() {
    return (
      <div className="paperWrapper">
        <Paper
          className="paper"
          zdepth={2}
        >
          <h1>Login</h1>
          <TextField
            label="ID"
            value={this.state.inputId}
            onChange={this.onInputChange('inputId')}
          />
          <br />
          <TextField
            label="Password"
            value={this.state.inputPassword}
            onChange={this.onInputChange('inputPassword')}
          />
          <br />
          <Button
            className="button"
            raised
            color="primary"
            onClick={() => this.props.onLogin({
              inputId: this.state.inputId,
              inputPassword: this.state.inputPassword,
            })}
          >
            접속
          </Button>
        </Paper>
      </div>
    );
  }
}
export default Login;
