import React from 'react';
import Tappable from 'react-tappable';
import Modal from 'react-modal';
import { withRouter } from 'react-router-dom';
import '../css/home.css';

import imgRecipe from './../img/ic_recipe.png';
import imgAdd from './../img/ic_add.png';
import imgFilter from './../img/ic_filter.png';
import imgSearch from './../img/ic_search.png';
import imgUp from './../img/ic_up.png';
import imgVegetarian from './../img/ic_vegetarian.png';
import imgFastFood from './../img/ic_fastfood.png';
import imgHealthy from './../img/ic_healthy.png';
import imgNoCook from './../img/ic_nocook.png';
import imgMakeAhead from './../img/ic_makeahead.png';

export default class Home extends React.Component {

  constructor(props){
    super(props);
    this.state = {message: '', recipeList:[],clickFilter:false,noRecipe:false,clickSearch:false,imgSearch:imgSearch, inputSearch: "",imgType:imgFilter,type:"All"};
    this.clickFilter = this.clickFilter.bind(this);
    this.filter = this.filter.bind(this);
    this.loadAll = this.loadAll.bind(this);
    this.clickDetail = this.clickDetail.bind(this);
    this.clickAdd = this.clickAdd.bind(this);
    this.clickSearch = this.clickSearch.bind(this);
    this.search = this.search.bind(this);
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  componentDidMount(){
    this.loadAll();
  }
  clickFilter(){
    this.setState({clickFilter:!(this.state.clickFilter)});
  }
  clickDetail(recipe){
    this.props.history.push({
      pathname: '/detail',
      state: {detail: recipe}
    });
  }
  clickAdd(){
    this.props.history.push('/add');
  }

  filter(type){
    var that =this;

    if(type == "All"){
      this.loadAll();
    }else{
    this.changeImgType(type);
    fetch('https://apppppp.000webhostapp.com/React/selectRecipeByType.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: JSON.stringify({
        type: type
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        that.setState({recipeList:responseJson.recipe,clickFilter:false,type:type,inputSearch:""});
        }
      ).catch((error) => {
        console.error(error);
      });
    }
  }

  changeImgType(type){
    var img;
    switch(type){
      case "Vegetarian": img = imgVegetarian;break;
      case "Fast Food": img = imgFastFood;break;
      case "Healthy": img = imgHealthy;break;
      case "No-Cook": img = imgNoCook;break;
      case "Make Ahead": img = imgMakeAhead;break;
    }
    this.setState({imgType:img});
  }
  loadAll(){
    var that =this;
    fetch('https://apppppp.000webhostapp.com/React/selectAllRecipe.php')
       .then((response) =>
         response.json()
       ).then((data) =>{
         that.setState({recipeList:data.recipe,clickFilter:false,imgType:imgFilter,type:"All",inputSearch:""});
       }
    );
  }

  clickSearch(){
    if(this.state.clickSearch){
      //closing
      this.setState({clickSearch:!(this.state.clickSearch),imgSearch:imgSearch});
    }else{
      this.setState({clickSearch:!(this.state.clickSearch),imgSearch:imgUp});
    }
  }
  search(){
    var that =this;
    fetch('https://apppppp.000webhostapp.com/React/searchRecipe.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: JSON.stringify({
        ingredient: that.state.inputSearch
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        that.setState({recipeList:responseJson.recipe,clickFilter:false,type:"All",imgType:imgFilter});
        }
      ).catch((error) => {
        console.error(error);
      });
  }

  render(){
    const recipeItem = this.state.recipeList.map((recipe) =>
    <li key={recipe.id} onClick={()=>this.clickDetail(recipe)}>{recipe.name}
    { this.state.type == "All" ? <p>{recipe.type}</p>:null}
    </li>);

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

      const type = [{text:"All",image:imgFilter}, {text:"Vegetarian",image:imgVegetarian},{text:"Fast Food",image:imgFastFood},{text:"Healthy",image:imgHealthy},{text:"No-Cook",image:imgNoCook},{text:"Make Ahead",image:imgMakeAhead}];
      const filterList = type.map((type) => <li style={{padding: "5px"}} key={type.text} onClick={()=>this.filter(type.text)}>{type.text}<img src={type.image} alt="imgType" width="50" height="50"/></li> );

    return (
      <div className="home">
      <header className="header">
        <img src={imgRecipe} alt="ic_recipe" onClick={this.loadAll} width="50" height="50"/>
        <h1>RecipeApp</h1>
        <img className="imgAdd" src={imgAdd} onClick={this.clickAdd} alt="ic_add" width="50" height="50"/>
        <img className="imgFilter" src={this.state.imgType} onClick={this.clickFilter} alt="ic_filter" width="50" height="50"/>
        <img className="imgSearch" src={this.state.imgSearch} onClick={this.clickSearch} alt="ic_search" width="50" height="50"/>
      </header>
        { this.state.clickSearch ? <div className={this.state.clickSearch ? "searchBarOpen":"searchBarClose"}>
        <input type="search" value={this.state.inputSearch} onChange={(e)=>this.setState({inputSearch: e.target.value})} />
        <img src={imgSearch} className="imgSearchBar" onClick={this.search} alt="ic_search" width="50" height="50"/>
        </div> :null}

      <Modal style={{padding:0}} isOpen={this.state.clickFilter} onRequestClose={this.clickFilter} contentLabel="Filter Modal"  style={customStyles}>
        <ul>{filterList}</ul>
        <button style={{margin:"10px"}} onClick={this.clickFilter}>Close</button>
      </Modal>
        { this.state.recipeList.length == 0 ? <h2>No Recipe Go Create One</h2>:null}
        <ul id="recipeList">
        {recipeItem}
        </ul>

      </div>
    );
  }
}
