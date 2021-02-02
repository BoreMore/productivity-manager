window.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll(".nav-switch").forEach((elem) => {
        elem.addEventListener('click', function() {
            // remove active class and add it to currently clicked item
            document.querySelectorAll(".nav-switch").forEach((elem) => {
                elem.classList.remove('active');
            })
            this.classList.add('active');

            // hide current view
            document.querySelectorAll('.view').forEach((elem) => {
                elem.style.display = 'none';
            });

            // select new view to show
            var selected_div = document.getElementById(this.getAttribute('data-view'));
            selected_div.style.display = "block";
        });
    });


    
    // manage the todo list and the current projects list
    function manageLists(addBtnId, localSaveName, inputId, listId, checkboxClass, markCompleteId) {
        document.getElementById(addBtnId).addEventListener('click', function() {
            current_val = [];
            
            // add item to list
            chrome.storage.local.get({[localSaveName]: []}, function(result) {
                current_val = result[localSaveName];
                current_val.push(document.getElementById(inputId).value);
    
                chrome.storage.local.set({[localSaveName]: current_val}, function() {
                    updateTodoList();
                })
            })
        })

        // update/rerender list
        var array_todo;
        function updateTodoList() {
            chrome.storage.local.get({[localSaveName]: []}, function(result) {
                document.getElementById(listId).innerHTML = '';
                array_todo = result[localSaveName];

                for (var i = 0; i < array_todo.length; i++) {
                    document.getElementById(listId).innerHTML += `
                        <li class="list-item">
                            <input class="${checkboxClass}" type="checkbox" name="todo-item" value="${array_todo[i]}">
                            <p>${array_todo[i]}</p>
                        </li>
                    `;
                }
            })
        }
        
        // mark item as complete
        document.getElementById(markCompleteId).addEventListener('click', function() {
            chrome.storage.local.get({[localSaveName]: []}, function(result) {
                current_val = result[localSaveName];
    
                var checkboxElems = document.getElementsByClassName(checkboxClass);
                for (var i = 0; i < checkboxElems.length; i++) {
                    if (checkboxElems[i].checked) {
                        //console.log(current_val.indexOf(checkboxElems[i].value))
                        current_val.splice(current_val.indexOf(checkboxElems[i].value), 1);
                    }
                }
                chrome.storage.local.set({[localSaveName]: current_val}, function() {
                    updateTodoList();
                });
            });
        })

        updateTodoList();
    }
    //manageLists('id of add button', 'name of local storage list', 'input box id', 'list element id', 'classes of project checkbox', 'id of mark complete button');
    manageLists('add-todo', 'productivity-manager-todo-list', 'todo-input', 'todo-list', 'todo-checkbox', 'mark-todo-complete');
    manageLists('add-project', 'productivity-manager-project-list', 'project-input', 'project-list', 'project-checkbox', 'mark-project-complete');





    // site blocking
    // add site to blocked sites
    document.getElementById('block-site').addEventListener('click', function() {
        current_val = [];

        chrome.storage.local.get({'productivity-manager-blocked-sites': []}, function(result) {
            //console.log(result['productivity-manager-blocked-sites']);
            current_val = result['productivity-manager-blocked-sites'];
            current_val.push(document.getElementById('site-to-block').value)
            //console.log(current_val)
            chrome.storage.local.set({'productivity-manager-blocked-sites': current_val}, function() {
                updateBlockedList();
            });
        });
    });

    // update/rerender blocked sites
    var array_of_blocked;
    function updateBlockedList() {
        chrome.storage.local.get({'productivity-manager-blocked-sites': []}, function(result) {
            document.getElementById('blocked-sites-list').innerHTML = '';
            array_of_blocked = result['productivity-manager-blocked-sites'];
            
            for (var i = 0; i < array_of_blocked.length; i++) {
                document.getElementById('blocked-sites-list').innerHTML += `
                    <li class="list-item">
                        <p>${array_of_blocked[i]}</p>
                        <button class="delete-blocked-site-btn" data-deleteid='${i}'>X</button>
                    </li>
                `;
            }   
            // delete a blocked site
            document.querySelectorAll(".delete-blocked-site-btn").forEach((elem) => {
                elem.addEventListener('click', function() {
                    elem_index = this.getAttribute('data-deleteid');
                    chrome.storage.local.get({'productivity-manager-blocked-sites': []}, function(result) {
                        current_val = result['productivity-manager-blocked-sites'];
                        
                        current_val.splice(elem_index, 1);

                        chrome.storage.local.set({'productivity-manager-blocked-sites': current_val}, function() {
                            updateBlockedList();
                        });
                    });
                });
            });
        }); 
    }

    updateBlockedList();
    
});