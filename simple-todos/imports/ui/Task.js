import React, { Component } from 'react';
import { Tasks } from '../api/tasks.js';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
 
// Task component - represents a single todo item
export default class Task extends Component {
  
toggleChecked() {
    // Set the checked property to the opposite of its current value
    // Tasks.update(this.props.task._id, {
    //   $set: { checked: !this.props.task.checked },
    // });

    //con esto agregamos seguirdad por que llamamos los metodos que se crean en el componente de MongoDB
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
}
 
deleteThisTask() {
    //Tasks.remove(this.props.task._id);
    
    //se agrega suguiridad mirando si esta logeado el usuario llamando los metodos del componente de mongo db en la app
    Meteor.call('tasks.remove', this.props.task._id);
}

//metodo para hacer privado una tarea
 togglePrivate() {
    Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);
  }

  render() {

  	// Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    //const taskClassName = this.props.task.checked ? 'checked' : '';
    const taskClassName = classnames({
      checked: this.props.task.checked,
      private: this.props.task.private,
    });
    return (
       <li className={taskClassName}>
        <button className="delete" onClick={this.deleteThisTask.bind(this)}>
          &times;
        </button>
 
        <input
          type="checkbox"
          readOnly
          checked={!!this.props.task.checked}
          onClick={this.toggleChecked.bind(this)}
        />

         { this.props.showPrivateButton ? (
          <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
            { this.props.task.private ? 'Private' : 'Public' }
          </button>
        ) : ''}
 
         <span className="text">
          <strong>{this.props.task.username}</strong>: {this.props.task.text}
         </span>

      </li>
    );
  }
}