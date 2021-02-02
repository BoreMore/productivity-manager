// inject "site blocked" script
chrome.storage.local.get({'productivity-manager-blocked-sites': []}, function(result) {
    array_of_blocked = result['productivity-manager-blocked-sites'];

    // check for times here eventually?
    // checks whether site is blocked
    if (array_of_blocked.indexOf(location.origin + '/') > -1) {
        var current_val = [];
        chrome.storage.local.get({'productivity-manager-todo-list': []}, function(result) {
            current_val = result['productivity-manager-todo-list'];

            // checks if theres items on the todo list
            if (current_val.length > 0) {
                // code to inject
                document.addEventListener('DOMContentLoaded', function() {
                    var blockedCode = "" +
                    "document.body.innerHTML = '';" +
                    "document.body.innerHTML = `" +
                        "<div class='position-absolute-blocked'>" +
                            "<div class='centered-blocked'>" +
                                "<h1>BLOCKED</h1>" +
                                "<p>You have blocked this site... finish your todo list first!</p>" +
                            "</div>" + 
                        "</div>" +
                    ";`";
        
                    var script = document.createElement('script');
                    script.innerHTML = blockedCode;
                    document.body.appendChild(script);    
                });
            }
        });
    }
})