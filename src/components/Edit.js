import React from 'react';
import Tappable from 'react-tappable';
import Modal from 'react-modal';

import '../css/edit.css';

import imgBack from './../img/ic_back.png';
import imgReset from './../img/ic_reset.png';
import imgDone from './../img/ic_done.png';

export default class Edit extends React.Component {

  constructor(props){
    super(props);
    this.state = {detail:this.props.location.state.detail,name: this.props.location.state.detail.name,
      ingredient: this.props.location.state.detail.ingredient,type: this.props.location.state.detail.type,
      step: this.props.location.state.detail.step, clickReset:false, errorName:false,errorIngredient:false,errorStep:false};
    this.goBack = this.goBack.bind(this);
    this.clickReset = this.clickReset.bind(this);
    this.reset = this.reset.bind(this);
    this.edit = this.edit.bind(this);
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  componentDidMount(){
  }

  clickReset(){
      this.setState({clickReset:!(this.state.clickReset)});
  }

  reset(){
    this.setState({name: this.state.detail.name,ingredient: this.state.detail.ingredient,step: this.state.detail.step,type:this.state.detail.type,clickReset:!(this.state.clickReset)});
  }

  edit(){
    var that =this;
    if(that.validation()){
      fetch('https://apppppp.000webhostapp.com/React/editRecipe.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: JSON.stringify({
          id: that.state.detail.id,
          name: that.state.name,
          ingredient: that.state.ingredient,
          step: that.state.step,
          type: that.state.type
        })
      }).then((response) => response.json())
        .then((responseJson) => {
          if(responseJson.status == 1){
            that.setState({detail:responseJson.recipe});
            that.goBack();
          }
          window.plugins.toast.show(responseJson.message,"short",'center');
          }
        ).catch((error) => {
          console.error(error);
        });
      }
  }

  validation(){
    this.setState({errorString:"",errorName:false,errorIngredient:false,errorStep:false});
    if(this.state.name === '' ){
      this.setState({errorName:true});
    }
    if(this.state.ingredient === '' ){
      this.setState({errorIngredient:true});
    }
    if(this.state.step === '' ){
      this.setState({errorStep:true});
    }
    if(this.state.errorName || this.state.errorIngredient || this.state.errorStep){
      return false;
    }
    return true;
  }

  goBack(){
    this.props.history.push({
      pathname: '/detail',
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
      const type = ["Vegetarian","Fast Food","Healthy","No-Cook","Make Ahead"];
      const typeItem = type.map((type) => <option key={type} value={type}>{type}</option>);


    return (
      <div className="edit">
      <header className="header">
        <img src={imgBack} onClick={this.goBack} alt="ic_recipe" width="50" height="50"/>
        <h1>Edit</h1>
        <img className="imgReset" src={imgReset} onClick={this.clickReset} alt="ic_reset" width="50" height="50"/>
        <img className="imgDone" src={imgDone} onClick={this.edit} alt="ic_done" width="50" height="50"/>
      </header>
      <Modal isOpen={this.state.clickReset} onRequestClose={this.clickReset} contentLabel="Reset Modal"  style={customStyles}>
        <h2>Are you sure to reset?</h2>
        <button onClick={this.reset}>Reset</button>
        <button id="btnNo" onClick={this.clickReset}>No</button>
      </Modal>
      <div>
      { this.state.errorName ? <h3>Name cannot be empty.</h3> :null}
      { this.state.errorIngredient ? <h3>Ingredient cannot be empty.</h3> :null}
      { this.state.errorStep ? <h3>Step cannot be empty.</h3> :null}
      </div>
      <h3 className="title">Name: </h3><textarea value={this.state.name} onChange={(e)=>this.setState({name: e.target.value})} cols={40} rows={4} />
      <h3 className="title">Ingredient: </h3><textarea value={this.state.ingredient} onChange={(e)=>this.setState({ingredient: e.target.value})} cols={40} rows={5} />
      <h3 className="title">Step: </h3><textarea value={this.state.step} onChange={(e)=>this.setState({step: e.target.value})} cols={40} rows={7} />
      <h3 className="title">Type: </h3>
      <select value={this.state.type} onChange={(e)=>this.setState({type: e.target.value})}>
        {typeItem}
      </select>
      </div>
    );
  }
}
