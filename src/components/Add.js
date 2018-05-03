import React from 'react';
import Tappable from 'react-tappable';
import Modal from 'react-modal';

import '../css/add.css';

import imgBack from './../img/ic_back.png';
import imgCancel from './../img/ic_cancel.png';
import imgDone from './../img/ic_done.png';

export default class Add extends React.Component {

  constructor(props){
    super(props);
    this.state = {clickCancel:false, errorName:false,errorIngredient:false,errorStep:false,errorType:false,name: "",ingredient: "",step: "",type:""};
    this.goBack = this.goBack.bind(this);
    this.clickCancel = this.clickCancel.bind(this);
    this.cancel = this.cancel.bind(this);
    this.add = this.add.bind(this);
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  clickCancel(){
      this.setState({clickCancel:!(this.state.clickCancel)});
  }

  cancel(){
    this.setState({name: "",ingredient: "",step: "",type:"",clickCancel:!(this.state.clickCancel)});
  }

  add(){
    var that =this;
    if(this.validation()){
      fetch('https://apppppp.000webhostapp.com/React/insertRecipe.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: JSON.stringify({
          name: that.state.name,
          ingredient: that.state.ingredient,
          step: that.state.step,
          type: that.state.type
        })
      }).then((response) => response.json())
        .then((responseJson) => {
          if(responseJson.success == 1){
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
    this.setState({errorName:false,errorIngredient:false,errorStep:false,errorType:false});
    if(this.state.name == '' ){
      this.setState({errorName:true});
    }
    if(this.state.ingredient == '' ){
      this.setState({errorIngredient:true});
    }
    if(this.state.step == '' ){
      this.setState({errorStep:true});
    }
    if(this.state.type == '' ){
      this.setState({errorType:true});
    }

    if(this.state.name == '' || this.state.ingredient == ''  || this.state.step == '' || this.state.type == ''){
      return false;
    }else{
      return true;
    }
  }

  goBack(){
    this.props.history.push('/');
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
      const type = ["","Vegetarian","Fast Food","Healthy","No-Cook","Make Ahead"];
      const typeItem = type.map((type) => <option key={type} value={type}>{type}</option>);


    return (
      <div className="add">
      <header className="header">
        <img src={imgBack} onClick={this.goBack} alt="ic_recipe" width="50" height="50"/>
        <h1>Add</h1>
        <img className="imgCancel" src={imgCancel} onClick={this.clickCancel} alt="ic_reset" width="50" height="50"/>
        <img className="imgDone" src={imgDone} onClick={this.add} alt="ic_done" width="50" height="50"/>
      </header>
      <Modal isOpen={this.state.clickCancel} onRequestClose={this.clickCancel} contentLabel="Reset Modal"  style={customStyles}>
        <h2>Are you sure to cancel?</h2>
        <button onClick={this.cancel}>Cancel</button>
        <button id="btnNo" onClick={this.clickCancel}>No</button>
      </Modal>
      <div>
      { this.state.errorName ? <h3>Name cannot be empty.</h3> :null}
      { this.state.errorIngredient ? <h3>Ingredient cannot be empty.</h3> :null}
      { this.state.errorStep ? <h3>Step cannot be empty.</h3> :null}
      { this.state.errorType ? <h3>Type cannot be empty.</h3> :null}
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
