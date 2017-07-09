import React, { Component } from 'react';
import axios from 'axios';
import { Dialog, TextField, FlatButton } from 'material-ui';

class Donate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      balance: '',
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sendDonation = this.sendDonation.bind(this);
  }

  handleClose() {
    this.props.toggleDonate();
  }

  handleChange(e) {
    this.setState({
      amount: e.target.value,
    });
  }

  sendDonation() {
    const params = {
      fromAddress: this.props.userWallet,
      //toAddress: this.props.project.,
      amount: this.state.amount,
    };
    axios.post('/projects/sendTransaction', params)
    .catch((err) => { console.log(err); })

    console.log('sending donation');
  }

  render() {
    const donateActions = [
      <FlatButton
        label="Confirm"
        primary
        onTouchTap={this.sendDonation}
      />,
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleClose}
      />,
    ];
    const { title } = this.props.project;
    const dialogTitle = "Donate to " + title;
    return (
      <div>
        <Dialog
          title={dialogTitle}
          actions={donateActions}
          open={this.props.showDonate}
          onRequestClose={this.handleClose}
        >
          <div>Your Balance: {this.props.balance} </div>
          <TextField floatingLabelText="Amount" type="number" onChange={this.handleChange} value={this.state.amount}/>
        </Dialog>
      </div>
    );
  }
}

export default Donate;
