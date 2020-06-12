let Task =  {
    init: function() {
        let app = this;

        // display username
        app.getUser();

        // event to display Tasks
        document.addEventListener('DOMContentLoaded', app.readTasks);
        //document.addEventListener('DOMContentLoaded', app.checkExceededTime);

        // event to add a task
        document.getElementById('buttonCreateTask').addEventListener('click', (event) => {
            event.preventDefault();
            app.createTask();
        });

        // event to remove a task
        document.getElementById('taskList').addEventListener('click', (event) => {
            event.preventDefault();
            if(event.target.classList.contains('button--delete')) {
                const taskID = parseInt(event.target.getAttribute('data-id'));
                app.deleteTask(taskID);
            }
        });

        // event to open edit form
        document.getElementById('taskList').addEventListener('click', (event) => {
            event.preventDefault();
            if(event.target.classList.contains('button--edit')) {
                const taskID = parseInt(event.target.getAttribute('data-id'));
                app.editTask(taskID);
            }
        });

        // event to close edit form
        document.getElementById('buttonCloseEdit').addEventListener('click', (event) => {
            event.preventDefault();
            app.closeEdit();
        });

        // event to update a task
        document.getElementById('buttonEditTask').addEventListener('click', (event) => {
            event.preventDefault();
            app.updateTask();
        });

        // event to add time
        document.getElementById('taskList').addEventListener('click', (event) => {
            event.preventDefault();
            if(event.target.classList.contains('button--add-time')) {
                const taskID = parseInt(event.target.getAttribute('data-id'));
                const worklog = event.target.previousElementSibling.value;
                app.addTime(taskID, worklog);
            }
        });

    },
    getUser: function() {
         const username = JSON.parse(window.localStorage.getItem('username'));
         document.getElementById('username').innerHTML = username; 
    },
    getTasks: function() {
        let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
        return tasks;
    },
    readTasks: function() {
        let tasks = Task.getTasks();
        let taskAlertClass;
        let list = document.getElementById('taskList');
        if(tasks == '') {
            list.innerHTML = 'No tasks available';
        } else {

            list.innerHTML = '';
            tasks.forEach((task) => {
                let regex = new RegExp(':', 'g'),
                estimatedTime = task.estimatedTime,
                worklog = task.worklog;
                if(parseInt(estimatedTime.replace(regex, ''), 10) < parseInt(worklog.replace(regex, ''), 10)){
                    taskAlertClass = 'js--alert';
                } else {
                    taskAlertClass = '';
                }


                const div = document.createElement('div');
                div.classList.add('task');
                div.innerHTML = `
                    <div class="task_wrap">
                        <form class="form form--add-worklog">
                            <div class="form_item">
                                <label class="form_label"><i class="fa fa-clock-o"></i>Worklog</label>
                                <input type="text" class="form_input form_input--worklog" size="10" maxlength="10" placeholder="HH:MM">
                                <button type="submit" class="button button--add-time" data-id="${task.taskID}">Add Time</button>
                                <div class="task_worklog ${taskAlertClass}">${task.worklog} worked time</div>
                            </div>
                        </form>
                        <h4 class="task_name">${task.name}</h4>
                        <p class="task_description">${task.description}</p>
                        <h6 class="task_estimated-time">Estimated time: <strong>${task.estimatedTime}</strong></h6>
                        <h6 class="task_beta-date">Beta date: <strong>${task.betaDate}</strong></h6>
                        <button href="#" class="button button--edit" data-id="${task.taskID}">Edit</button>
                        <button href="#" class="button button--delete" data-id="${task.taskID}">Delete</button>
                    </div>
                `;
                list.appendChild(div);
            });
        }
    },
    createTask: function() {
        // get values from the form
        let taskID = Date.now();
        let name = document.getElementById('nameInput').value;
        let description = document.getElementById('descriptionInput').value;
        let estimatedTime = document.getElementById('estimatedTimeInput').value;
        let betaDate = document.getElementById('betaDateInput').value;
        let userID = JSON.parse(window.localStorage.getItem('username'));
        let worklog = '00:00';
        if(name === '' || description === '' || estimatedTime === '' || betaDate === '') {
            alert("Insert values");
        } else if(Task.validateTime(estimatedTime) == false) {
            alert("Incorect time");
        } else if(Task.validateDate(betaDate) == false) {
            alert("Incorrect date");
        } else {
            let task = {
                taskID: taskID, 
                name: name, 
                description: description, 
                estimatedTime: estimatedTime, 
                betaDate: betaDate, 
                userID: userID, 
                worklog: worklog
            };
            let tasks = Task.getTasks();
            tasks.push(task); 
            localStorage.setItem('tasks', JSON.stringify(tasks));
            Task.readTasks();
            Task.resetForm();
        }
    },
    deleteTask: function(taskID) {
        let ok = confirm('Are you sure you want to delete?');
        if(ok) {
            let tasks = Task.getTasks();
            tasks.forEach((task, index) => {
                if(task.taskID === taskID) {
                    tasks.splice(index, 1);
                }
            });        
            localStorage.setItem('tasks', JSON.stringify(tasks));
            Task.readTasks();
        }
    },
    editTask: function(taskID) {
        let tasks = Task.getTasks();
        tasks.forEach((task, index) => {
            if(task.taskID === taskID) {
                task = tasks[index];
                document.getElementById('idInputEdit').value = task.taskID;
                document.getElementById('nameInputEdit').value = task.name;
                document.getElementById('descriptionInputEdit').value = task.description;
                document.getElementById('estimatedTimeInputEdit').value =  task.estimatedTime;
                document.getElementById('betaDateInputEdit').value = task.betaDate;
                document.getElementById('worklogInputEdit').value = task.worklog;
            }
        });
        document.body.classList.add("js--edit"); 
    },
    closeEdit: function() {
        document.body.classList.remove("js--edit"); 
    },
    updateTask: function() {
        let taskID = document.getElementById('idInputEdit').value;
        let name = document.getElementById('nameInputEdit').value;
        let description = document.getElementById('descriptionInputEdit').value;
        let estimatedTime = document.getElementById('estimatedTimeInputEdit').value;
        let betaDate = document.getElementById('betaDateInputEdit').value;
        let worklog = document.getElementById('worklogInputEdit').value;
        if(name === '' || description === '' || estimatedTime === '' || betaDate === '') {
            alert("Insert values");
        } else if(Task.validateTime(estimatedTime) == false) {
            alert("Incorect time");
        } else if(Task.validateDate(betaDate) == false) {
            alert("Incorrect date");
        } else if(Task.validateTime(worklog) == false) {
            alert("Incorect time");
        } else {
            let tasks = Task.getTasks();
            tasks.forEach((task, index) => {
                if(task.taskID == taskID) {
                    tasks[index].name = name;
                    tasks[index].description = description;
                    tasks[index].estimatedTime =  estimatedTime;
                    tasks[index].betaDate = betaDate;
                    tasks[index].worklog = worklog;

                }
            });
            document.body.classList.remove("js--edit"); 
            localStorage.setItem('tasks', JSON.stringify(tasks));
            Task.readTasks();
        }
    },
    addTime: function(taskID, worklog) {
        if(worklog == '') {
            alert('Insert time');
        } else if(Task.validateTime(worklog) == false) {
            alert("Incorect time");
        } else {
            let tasks = Task.getTasks();
            tasks.forEach((task, index) => {
                if(task.taskID == taskID) {
                    let oldWorklog = tasks[index].worklog;
                    let newWorklog = Task.sumTimes(oldWorklog,worklog);
                    tasks[index].worklog = newWorklog;
                }
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            Task.readTasks();
        }
    },
    resetForm: function() {
        document.getElementById('nameInput').value = '';
        document.getElementById('descriptionInput').value = '';
        document.getElementById('estimatedTimeInput').value = '';
        document.getElementById('betaDateInput').value = '';
    },
    validateDate: function(betaDate) { 
        let arr = betaDate.match(/^(\d{1,2})(\/|-)(\d{1,2})\2(\d{4})$/); 
        if (arr == null)  {
            return false;
        } 
        let month = arr[1]; 
        let day = arr[3];
        let year = arr[4];
        if (month < 1 || month > 12) { 
            return false;
        } else if(day < 1 || day > 31) {
            return false;
        } else if((month==4 || month==6 || month==9 || month==11) && day==31) {
            return false;
        } else if (month == 2) {
            let isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
            if (day>29 || (day==29 && !isleap)) {
                    return false;
            }
        }
        if (day.charAt(0) == '0') day = day.charAt(1);
        return true;  
    },
    validateTime: function(time) { 
        if(time == "" || time.indexOf(":")<0) {
            return false;
        } else {
            let hours = time.split(':')[0];
            let minutes = time.split(':')[1];
    
            if(hours == "" || isNaN(hours) || parseInt(hours)<0)
            {
                return false;
            } else if(parseInt(hours) == 0) {
                hours = "00";
            } else if (hours <10) {
                hours = "0"+hours;
            }
                
            if(minutes == "" || isNaN(minutes) || parseInt(minutes)>59) {
                return false;
            } else if(parseInt(minutes) == 0) {
                minutes = "00";
            } else if (minutes <10) {
                minutes = "0"+minutes;    
            }    
        }
        return true;
    },
    sumTimes: function(time1,time2) {
        let times = [ 0, 0, 0 ]
        let max = times.length;
        let a = (time1 || '').split(':');
        let b = (time2 || '').split(':');
        for (let i = 0; i < max; i++) {
           a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i]);
           b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i]);
        }
        for (let i = 0; i < max; i++) {
            times[i] = a[i] + b[i];
        }
        let minutes = times[1];
        let hours = times[0];
        if (minutes >= 60) {
            res = (minutes / 60) | 0;
            hours += res;
            minutes = minutes - (60 * res);

            minutes = minutes < 10 ? "0" + minutes : minutes;
        }
        result = hours + ':' + minutes;
        return result;
    }
}

Task.init();
