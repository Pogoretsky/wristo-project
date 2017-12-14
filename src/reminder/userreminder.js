import React, { Component } from 'react';
import './reminder.scss';
import edit from '../assets/icons/pensil.png';
import axios from 'axios';

let arrayofid = [];
function UserName(props){
	return (
		<div className="user-name" >
			<div><img src="https://n6-img-fp.akamaized.net/free-icon/baby-head-with-a-small-heart-outline_318-46289.jpg?size=338c&ext=jpg" alt=""/><p>{props.firstname}<br/>{props.lastname}</p></div>	
			<div><img className="edit" src={edit} alt="" /></div>
		</div>
	)
}
const Event = (props) => {
	return (
		<div className="dayevents" style={{backgroundColor: props.color}}>
			<img src="http://www.iconarchive.com/download/i82455/medicalwp/medical/Pills-blue.ico" alt="" />
			<p>{props.title}<br/>{props.time}</p>		
		</div>
	)
}
var opo = 0
class Createwearer extends React.Component{
	constructor(props){
		super(props);
		this.createevent = this.createevent.bind(this);
		this.getReminders = this.getReminders.bind(this);
		this.state = {
			flag: false,
			monday: [],
			tuesday: [],
			wednesday: [],
			thursday: [],
			friday: [],
			saturday: [],
			sunday: [],
			number: 0
		}
	}
	createevent(item){
		//console.log("item", item);
		//debugger;
		var date = new Date(item.start_date);
		var hours = date.getHours(), minutes = date.getMinutes(),day = date.getDay() , color;
		if(hours < 10) hours = '0' + hours;
		if(minutes < 10) minutes = '0' + minutes;
		var time = `${hours}:${minutes}`;
		var category = item.category;
		//debugger;
		if(day == 1 && this.props.weekarray[0].day == date.getDate() && this.props.id == item.wearer_id){
			this.state.monday.push(returnevent())
		}else if(day == 2 && this.props.weekarray[1].day == date.getDate() && this.props.id == item.wearer_id){
			this.state.tuesday.push(returnevent())
		}else if(day == 3 && this.props.weekarray[2].day == date.getDate() && this.props.id == item.wearer_id){
			this.state.wednesday.push(returnevent())
		}else if(day == 4 && this.props.weekarray[3].day == date.getDate() && this.props.id == item.wearer_id){
			this.state.thursday.push(returnevent())
		}else if(day == 5 && this.props.weekarray[4].day == date.getDate() && this.props.id == item.wearer_id){
			this.state.friday.push(returnevent())
		}else if(day == 6 && this.props.weekarray[5].day == date.getDate() && this.props.id == item.wearer_id){
			this.state.saturday.push(returnevent())
		}else if(day == 0 && this.props.weekarray[6].day == date.getDate() && this.props.id == item.wearer_id){
			this.state.sunday.push(returnevent())
		}
		function returnevent(){
			switch (category) 
			{
			case "social": 
				color = "#E3F0F9"; break;
			case "medical": 
				color = "#FFF0D0"; break;
			default: 
				color = "#ececec"; break;
			}
			return (
			<Event time={time} color={color} title={item.title}/>
		) 
		}
	}
	componentWillReceiveProps(nextProps){
		this.setState({
			done: false,
			monday: [],
			tuesday: [],
			wednesday: [],
			thursday: [],
			friday: [],
			saturday: [],
			sunday: []
		})
		this.state.wearershow = nextProps.wearershow;
		console.log("show=====",this.state.wearershow);
		this.state.idid = nextProps.id;
		this.getReminders();
	}

	getReminders(){
		axios({
	      method: 'get',
	      url: 'https://wristo-platform-backend-stg.herokuapp.com/api/v1/groups/' + this.props.groupid + '/wearers/' + this.state.idid + '/reminders',
	      headers: {'X-Requested-With': 'XMLHttpRequest', 'accept': 'application/json', 'content-type': 'application/json', 
     	 'uid': 'boretskairuna23@gmail.com', 'client': 'ldhWd6MKE0QI-pn39bcuag', 'access-token': 'NOoEY1SGJa_Sy_TVwq_jYA'},
	      responseType: 'json'
	   	}).then(response => {
	   		this.setState({reminders:  response.data});
	    }).then(response => {
	    	this.filterReminders(this.state.reminders);
	    	this.setState({done: true});
	    }).catch((error) => { 
	        console.log(error);
	    });
	}
	componentWillMount(){
		this.state.idid = this.props.id;
		this.getReminders();
	}

	filterReminders(reminders){
		this.state.filteredreminders = reminders.filter(item => {
			//console.log("item", item);
			let date = new Date(item.start_date);
			if(date.getDate() >= this.props.weekarray[0].day && date.getDate() <= this.props.weekarray[6].day){
				return item;	
			}
		})
		this.state.filteredreminders.map(this.createevent);
	}
	render(){
		if(this.state.done){
			return (
				<div className="user">
					<UserName lastname={this.props.lastname} firstname={this.props.firstname}/>
					<div className="events" >
						{this.state.monday}
					</div>
					<div className="events" >
						{this.state.tuesday}
					</div>
					<div className="events" >
						{this.state.wednesday}
					</div>
					<div className="events" >
						{this.state.thursday}
					</div>
					<div className="events" >
						{this.state.friday}
					</div>
					<div className="events" >
						{this.state.saturday}
					</div>
					<div className="events" >
						{this.state.sunday}
					</div>
				</div>
			)
	} else { return null}
	}
}

export default class UserEvents extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			newWearers: [],
			wearershow: 0
		}
	}
	// componentWillUpdate(){
	// 	if(this.props.wearershow){
	// 		for(let i = 0; i < this.props.wearershow.length; i++){
	// 			arrayofid[i] = this.props.wearershow[i]
	// 		}
	// 	}
	// 	this.state.filter = arrayofid.map(this.createwearer.bind(this))	
	// }
	componentWillReceiveProps(nextProps){
		this.state.wearershow = nextProps.wearershow;
		this.state.id = nextProps.id;
		if(!nextProps.wearers) 
			return false
		else if(nextProps.wearershow === "all users" || nextProps.wearershow === 0){
			arrayofid = [];
			for(let i = 0; i < nextProps.wearers.length; i++){
				arrayofid[i] = nextProps.wearers[i]
			}
		} else if(nextProps.wearershow !== "all users"){
			arrayofid = [];
			for(let i = 0; i < nextProps.wearers.length; i++){
				if(nextProps.wearers[i].id == nextProps.wearershow) {
					arrayofid[0] = nextProps.wearers[i]
				}
			}
		}
		this.setState({filter: arrayofid.map(this.createwearer.bind(this))})
	}
	createwearer(item){
		return <Createwearer wearershow={this.state.wearershow} id={item.id} groupid={this.state.id}  firstname={item.full_name} weekarray={this.props.weekarray}/>
	}
	render(){
		console.log(this.props)
		return (
			<div>
				{this.state.filter}
			</div>
		)
	}
}