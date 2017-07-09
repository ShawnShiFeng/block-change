import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import { toggleDonate, setProjectInFocus, setBalance, setProjectBalance } from '../actions';
import HeaderPlain from '../components/HeaderPlain';
import Footer from '../components/Footer';
import Donate from '../components/Donate';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarTitle,
  FlatButton,
  RaisedButton,
  LinearProgress } from 'material-ui';
import Transaction from '../components/Transaction';

import './css/Project.css';

const style = {
  margin: 12,
};

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      home: false,
      donations: [],
    };
    this.changeProp = this.changeProp.bind(this);
    this.getDonations = this.getDonations.bind(this);
    this.openDonate = this.openDonate.bind(this);
  }

  openDonate() {
    this.props.toggleDonate();
    axios.get('/projects/getBalance/' + this.props.projects[this.props.index].project_wallet)
    .then((res) => {
      this.props.setBalance(res.data.balance);
    })
    .catch((err) => { console.log(err); });
  }

  changeProp(key, val) {
    this.setState({
      [key]: val,
    });
  }

  getDonations(id) {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_id: id,
      }),
    };

    fetch('/projects/getTxDonations', options)
      .then(res => res.json())
      .then((res) => {
        console.log(res);
        this.setState({ donations: res });
      })
      .catch((err) => {
        console.error(`failed to get donations: ${err}`);
      });
    // this.setState({
    //   donations: [
    //   {
    //     txhash: "0x37e79336470fd033075078e75a29002a97da483f671d2db1a9d35220b4c91c0d",
    //     blockHeight: "1262142 (5292 block confirmations)",
    //     from: "0xfb66419fa21f0adc5a2e477bea235d1059b19e7e",
    //     to: "0x6d99b71fb15b270fd00ae09a7218c4cab1695041",
    //     value: "49 Ether ($0.00)"
    //   },
    //   {
    //     txhash: "0x37e79336470fd033075078e75a29002a97da483f671d2db1a9d35220b4c91c0d",
    //     blockHeight: "1262142 (5292 block confirmations)",
    //     from: "0xfb66419fa21f0adc5a2e477bea235d1059b19e7e",
    //     to: "0x6d99b71fb15b270fd00ae09a7218c4cab1695041",
    //     value: "49 Ether ($0.00)"
    //   }]
    // })
  }


  componentDidMount() {
    const { id } = this.props.projects[this.props.index];
    this.getDonations(id);
  }

  render() {
    const { id, title, description, goal, image, project_wallet } = this.props.projects[this.props.index];
    if (this.state.home) {
      return <Redirect to="/" />
    }
    return (
      <div style={{width: "100%"}}>
        <HeaderPlain />
        <div style={{margin: "auto", width: "65%", padding: "20px"}}>
          <Card>
            <CardMedia>
              <img src={image}/>
            </CardMedia>

            <CardTitle title={title}/>
            <div style={{ padding: "10px" }}>
              Goal: {goal}
            </div>
            <div style={{ padding: "10px" }}>
              Amount Raised: {this.props.projectBalance}
            </div>
            <div style={{ padding: "10px" }}>
              Wallet address: {project_wallet}
            </div>
            <div style={{ padding: "10px" }}>
              <LinearProgress mode="determinate" value={(this.props.projectBalance/goal) * 100} />
            </div>

            <CardText>{description}</CardText>

            <CardActions>
              <RaisedButton primary={true} style={style} label="Donate" onTouchTap={this.props.toggleDonate}/>
              <Donate
                {...this.props}
                getDonations={this.getDonations}
                project={this.props.projects[this.props.index]}
              />
            </CardActions>

            <CardTitle subtitle="Transaction History" actAsExpander={true} showExpandableButton={true}/>

            <CardText expandable={true}>
            {
              this.state.donations.map((transaction, index) => <Transaction key={index} transaction={transaction} /> )
            }
            </CardText>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    projects: state.main.projects,
    showDonate: state.donate.showDonate,
    profile: state.profile,
    userWallet: state.profile.currentUserWallet,
    balance: state.donate.balance,
    projectBalance: state.donate.projectBalance,
  };
};

const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    toggleDonate, setProjectInFocus, setBalance, setProjectBalance,
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Project);
