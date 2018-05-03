import React from 'react';
import Tappable from 'react-tappable';
import Modal from 'react-modal';

import '../css/detail.css';

import imgBack from './../img/ic_back.png';
import imgDelete from './../img/ic_delete.png';
import imgEdit from './../img/ic_edit.png';
import imgVegetarian from './../img/ic_vegetarian.png';
import imgFastFood from './../img/ic_fastfood.png';
import imgHealthy from './../img/ic_healthy.png';
import imgNoCook from './../img/ic_nocook.png';
import imgMakeAhead from './../img/ic_makeahead.png';

export default class Detail extends React.Component {

  constructor(props){
    super(props);
    this.state = {detail:this.props.location.state.detail,clickDelete:false,imgType:""};
    this.goBack = this.goBack.bind(this);
    this.clickDelete = this.clickDelete.bind(this);
    this.clickEdit = this.clickEdit.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  componentDidMount(){
      var img;
      switch(this.state.detail.type){
        case "Vegetarian": img = imgVegetarian;break;
        case "Fast Food": img = imgFastFood;break;
        case "Healthy": img = imgHealthy;break;
        case "No-Cook": img = imgNoCook;break;
        case "Make Ahead": img = imgMakeAhead;break;
      }
      this.setState({imgType:img});
  }

  goBack(){
    this.props.history.push('/');
  }

  clickDelete(){
    this.setState({clickDelete:!(this.state.clickDelete)});
  }
  delete(){
    var that =this;
    fetch('https://apppppp.000webhostapp.com/React/deleteRecipe.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: JSON.stringify({
        id: that.state.detail.id
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.status == 1){
          that.goBack();
        }
        window.plugins.toast.show(responseJson.message,"short",'center');
        }
      ).catch((error) => {
        console.error(error);
      });
  }

  clickEdit(){
    this.props.history.push({
      pathname: '/edit',
      state: {detail: this.state.detail}
    });
  }
  render(){
    const customStyles = {
      overlay: {
        position: 'fixed', top:0, bottom:0, right:0, left:0,backgroundColor: 'rgba(255,255,255,0.75)'
      },
        content : {
          position: 'absolute', borderRadius: '4px',
          top                   : '40px',
          left                  : '40px',
          right                 : '40px',
          bottom                : 'auto'
        }
      };

    return (
      <div className="detail">
      <header className="header">
        <img src={imgBack} onClick={this.goBack} alt="ic_recipe" width="50" height="50"/>
        <h1>Detail</h1>
        <img className="imgDelete" onClick={this.clickDelete} src={imgDelete} alt="ic_delete" width="50" height="50"/>
        <img className="imgEdit" onClick={this.clickEdit} src={imgEdit} alt="ic_edit" width="50" height="50"/>
      </header>
      <Modal isOpen={this.state.clickDelete} onRequestClose={this.clickDelete} contentLabel="Delete Modal"  style={customStyles}>
        <h2>Are you sure to delete?</h2>
        <button id="btnDelete" onClick={this.delete}>Delete</button>
        <button id="btnNo" onClick={this.clickDelete}>No</button>
      </Modal>
      <h3 className="title">Name: </h3><h3>{this.state.detail.name}</h3>
      <h3 className="title">Ingredient: </h3><h3>{this.state.detail.ingredient}</h3>
      <h3 className="title">Step: </h3><h3>{this.state.detail.step}</h3>
      <h3 className="title">Type: </h3>
      <div style={{display: "inline-flex"}}><h3>{this.state.detail.type}</h3><img src={this.state.imgType} alt="ic_type" width="50" height="50"/></div>

      </div>
    );
  }
}
