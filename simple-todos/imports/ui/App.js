import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Tasks } from '../api/tasks.js'; 
import Task from './Task.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';
import { Meteor } from 'meteor/meteor';
 
// App component - represents the whole app
class App extends Component {
  // getTasks() {
  //   return [
  //     { _id: 1, text: 'This is task 1' },
  //     { _id: 2, text: 'This is task 2' },
  //     { _id: 3, text: 'This is task 3' },
  //   ];
  // }

 constructor(props) {
    super(props);
 
    this.state = {
      hideCompleted: false,
    };
  } 

 //Metodo para escuchar las acciones del usuario en el navegador 
 handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
 
    Tasks.insert({
      text,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),           // _id of logged in user
      username: Meteor.user().username,  // username of logged in user
    });
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  //se actualiza el estado de forma asincronica y luego hra que el componente se vuelva a rederizar
  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderTasks() {
    //filtrar las tareas
    let filteredTasks = this .props.tasks;
    if ( this .state.hideCompleted) {
      filteredTasks = filteredTasks.filter (task =>! task.checked);
    }
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;
 
      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
    // return filteredTasks.map ((task) => (
    // //return this.getTasks().map((task) => (
    // //return this.props.tasks.map((task) => (
    //   <Task key={task._id} task={task} />
    // ));
  }
 
  render() {
    return (
      <div className="container">
        <header>
           <h1>Todo List ({this.props.incompleteCount})</h1>
          
          {/*casilla de verificacion*/}
          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label> 

          {/*componente para la autenticacion*/}
          <AccountsUIWrapper />

          {/*formulario para agregar una tarea*/}
          { this.props.currentUser ?
          <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add new tasks"
            />
          </form> : ''
        }
        </header>

        {/*Aqui va la lista de tareas*/}
        <ul>
          {this.renderTasks()}
        </ul>
        
      </div>
    );
  }
}

export default withTracker(() => {
  //se hace la suscripcion del metodo despues de borrar el autopublish
  Meteor.subscribe('tasks');

  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
})(App);