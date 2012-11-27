/**
 * Moodle mobile settings lib
 *
 * @package core
 * @copyright Juan Leyva <juanleyvadelgado@gmail.com>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


MM.settings = {
    display:  function() {
        
        // Settings plugins.
        var plugins = [];
        for (var el in MM.plugins) {
            var plugin = MM.plugins[el];
            if (plugin.settings.type == "setting") {
                plugins.push(plugin.settings);
            }
        }
        
        var html = MM.tpl.render($("#settings_template").html(), {plugins: plugins});
        MM.panels.show("center", html);
        if (MM.deviceType == "tablet") {
            MM.settings.showSection("sites");
        }
    },
    
    showSection: function(section) {
        // We call dinamically the function.
        MM.settings["show" + section.charAt(0).toUpperCase() + section.slice(1)]();
    },
    
    showSites: function() {

        var settings = [
            {id: "add_site", type: "button", label: MM.lang.s("addsite"), handler: MM.settings.addSite}
        ];
        
        // Render the settings as html.
        var html = MM.widgets.render(settings);

        var sites = [];
        
        MM.db.each("sites", function(el) {
            sites.push(el.toJSON());
        });
        
        
        MM.collections.sites.fetch();
        
        var tpl = '\
            <div class="sites-list">\
            <ul class="nav nav-v">\
            <% _.each(sites, function(site){ %>\
            <li class="nav-item">\
                <a href="#settings/sites/<%= site.id %>"><div class="bd">\
                <h3><%= site.sitename %>\
                <% if (site.id == current_site) { print(" (*)"); }; %>\
                </h3>\
                &nbsp;&nbsp;&nbsp;&nbsp;<i><%= site.siteurl %></i>\
                </div></a>\
            </li>\
            <% }); %>\
            </ul></div>';
        
        html += MM.tpl.render(tpl, {sites: sites, current_site: MM.config.current_site.id});
        MM.panels.show("right", html);
        // Once the html is rendered, we pretify the widgets.
        MM.widgets.enhance(settings);
        MM.widgets.addHandlers(settings);

    },
    
    showSite: function(siteId) {
        var site = MM.db.get("sites", siteId);
        var options = {
            modal: true,
            resizable: false,
            buttons: {}
        };
        
        var text = '\
        <h4>' + site.get("sitename") + '</h4>\
        <p><strong>' + MM.lang.s("siteurllabel") + ':</strong> ' + site.get("siteurl") + '</p>\
        <p><strong>' + MM.lang.s("fullname") + ':</strong> ' + site.get("fullname") + '</p>\
        ';
        
        if (siteId != MM.config.current_site.id) {
            options.buttons[MM.lang.s("select")] = function() {
                $(this).dialog("close");
                MM.loadSite(siteId);
            };
        }
        options.buttons[MM.lang.s("delete")] = function() {
            MM.Router.navigate("settings/sites/delete/" + siteId, {trigger: true, replace: true});
        };
        options.buttons[MM.lang.s("cancel")] = function() {
            $(this).dialog("close");
            MM.Router.navigate("settings/sites/");
        };
        
        MM.widgets.dialog(text, options);
    },

    deleteSite: function(siteId) {
        var site = MM.db.get("sites", siteId);
        MM.popConfirm(MM.lang.s("deletesite"), function() {
            var count = MM.db.length("sites");
            if (count == 1) {
                MM.widgets.dialogClose();
                MM.popErrorMessage(MM.lang.s("donotdeletesite"));
            } else {
                MM.db.remove("sites", siteId);
            }
        });
    },

    resetApp: function() {
        MM.popConfirm(MM.lang.s("areyousurereset"), function() {
            // Delete all the entries in local storage
            for(var el in localStorage) {
                localStorage.removeItem(el);
            }
            // Redirect to maing page
            location.href = "index.html";
        });
    },

    showSync: function() {
        var settings = [
            {id: "sync_ws_on", type: "checkbox", label: MM.lang.s("enableautosyncws"), checked: true, handler: MM.settings.checkboxHandler},
            {id: "sync_lang_on", type: "checkbox", label: MM.lang.s("enableautosynccss"), checked: true, handler: MM.settings.checkboxHandler},
            {id: "sync_css_on", type: "checkbox", label: MM.lang.s("enableautosynclang"), checked: true, handler: MM.settings.checkboxHandler}
        ];

        // Load default values
        $.each(settings, function(index, setting) {
            if (setting.type == "checkbox") {
                if (typeof(MM.getConfig(setting.id)) != "undefined") {
                    settings[index].checked = MM.getConfig(setting.id);
                }
            }
        });
        
        // Render the settings as html.
        var html = MM.widgets.render(settings);

        var syncFilter = MM.db.where("sync", {siteid: MM.config.current_site.id});
        var syncTasks = [];
        
        $.each(syncFilter, function(index, el) {
            syncTasks.push(el.toJSON());
        });
        
        var tpl = '\
            <ul class="nav nav-v">\
            <% _.each(tasks, function(task){ %>\
            <li class="nav-item">\
                <%= task.syncData.name %><br>\
                &nbsp;&nbsp;&nbsp;&nbsp;<i><%= task.syncData.description %></i>\
            </li>\
            <% }); %>\
            </ul>';
        
        html += MM.tpl.render(tpl, {tasks: syncTasks});

        MM.panels.show("right", html);
        // Once the html is rendered, we pretify the widgets.
        MM.widgets.enhance(settings);
        MM.widgets.addHandlers(settings);
    },
    
    showDevelopment: function() {

        var settings = [
            {id: "dev_debug", type: "checkbox", label: MM.lang.s("enabledebugging"), checked: false, handler: MM.settings.checkboxHandler},
            {id: "dev_offline", type: "checkbox", label: MM.lang.s("forceofflinemode"), checked: false, handler: MM.settings.checkboxHandler},
            {id: "dev_fakenotifications", type: "button", label: MM.lang.s("addfakenotifications"), handler: MM.settings.addFakeNotifications},
            {id: "dev_loadcordovaemulator", type: "button", label: MM.lang.s("loadcordovaemulator"), handler: MM.cordova.loadEmulator},
            {id: "dev_resetapp", type: "button", label: MM.lang.s("resetapp"), handler: MM.settings.resetApp}
        ];

        // Load default values
        $.each(settings, function(index, setting) {
            if (setting.type == "checkbox") {
                if (typeof(MM.getConfig(setting.id)) != "undefined") {
                    settings[index].checked = MM.getConfig(setting.id);
                }
            }
        });
        
        // Render the settings as html.
        var html = MM.widgets.render(settings);
        MM.panels.show("right", html);
        // Once the html is rendered, we pretify the widgets.
        MM.widgets.enhance(settings);
        MM.widgets.addHandlers(settings);
    },
    
    checkboxHandler: function(e, setting) {
        
        var val = false;
        if ($("#" + setting.id).is(':checked')) {
            val = true;
        }

        MM.setConfig(setting.id, val);
    },
    
    addFakeNotifications: function(e, setting) {
        for (var i=0; i < 5 ; i++) {
            MM.db.insert("notifications", {
                siteid: MM.config.current_site.id,
                subject: "Notification " + i,
                date: "23 Dec 2012",
                fullmessage: "Full message of the notification, here we have the full text for this notification. This notification is random created"
            });
        }
        // This is for preserving the Backbone hash navigation.
        e.preventDefault();
    },
    
    addSite: function(e, setting) {
        
        var html = "";
        
        var options = {
            title: MM.lang.s("addsite"),
            modal: true,
            buttons: {}
        }
        options.buttons[MM.lang.s("add")] = function(){
            var siteurl =  $.trim($("#new-url").val());
            var username = $.trim($("#new-username").val());
            var password = $.trim($("#new-password").val());
            
            $("form span.error").css("display", "block").html("");
    
            // Delete the last / if present.
            if(siteurl.charAt(siteurl.length-1) == '/'){
                siteurl = siteurl.substring(0,siteurl.length-1);
            }
            
            var stop = false;

            if(siteurl.indexOf("http://localhost") == -1 && ! /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(siteurl)){                    
                stop = true;
                $("#new-url").next().html(MM.lang.s("siteurlrequired"));
            }
            
            if (MM.db.get("sites", hex_md5(siteurl + username))) {
                stop = true;
                $("#new-url").next().html(MM.lang.s("siteexists"));
            }
            
            if(!username){                    
                stop = true;
                $("#new-username").next().html(MM.lang.s("usernamerequired"));
            }
            if(!password){
                stop = true;
                $("#new-password").next().html(MM.lang.s("passwordrequired"));
            }
            
            if (!stop) {
                $( this ).dialog( "close" );
                MM.saveSite(username, password, siteurl);
            }
        };
        options.buttons[MM.lang.s("cancel")] = function(){
            $( this ).dialog( "close" );   
        };
        
        html = '\
        <form>\
            <p>\
                <input type="url" id="new-url" placeholder="' +  MM.lang.s("siteurl") + '">\
                <span class="error"></div>\
            </p>\
            <p>\
                <input type="text" id="new-username" placeholder="' +  MM.lang.s("username") + '">\
                <span class="error"></div>\
            </p>\
            <p>\
                <input type="password" id="new-password" placeholder="' +  MM.lang.s("password") + '">\
                <span class="error"></div>\
            </p>\
        </form>\
        ';
        
        MM.widgets.dialog(html, options);
        e.preventDefault();
    }
}