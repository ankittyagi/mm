var templates = [
    "root/externallib/text!root/plugins/profile/profile.html",
	"root/externallib/text!root/plugins/profile/editprofile.html",
];

define(templates,function (profileTpl,profileTp2) {
    var plugin = {
        settings: {
            name: "profile",
            type: "general",
			menuURL: "#profile/viewprofile",
		    lang: {
                component: "core"
            }
        },
         storage: {
          profile: {type: "model"},
		  editprofile: {type: "collection", model: "profile"},
		  
       },
        routes: [
            ["profile/viewprofile", "profile", "showProfile"],	
            ["profile/editprofile", "profile", "editProfile"],	
			["profile/updateprofile", "profile", "updateProfile"],	
		],
		
		showProfile: function() {
			 var siteid=MM.config.current_site.id;
			 var site = MM.db.get("sites", siteid);
			 var userid= site.get('userid');
			
			 MM.panels.showLoading('center');
            
            if (MM.deviceType == "tablet") {
                MM.panels.showLoading('right');
            }
    
            var data = {
                "userids[0]" : userid 
            };
            
            MM.moodleWSCall('moodle_user_get_users_by_id', data, function(users) {    // local_usersget_getuser_by_id 
			    var tpl = {users: users, deviceType: MM.deviceType,"user": users.shift()};
                var html = MM.tpl.render(MM.plugins.profile.templates.profile.html, tpl);
                MM.panels.show('center', html);  
			
            }); 
        
		   },
		editProfile: function() {
			var siteid=MM.config.current_site.id;
			 var site = MM.db.get("sites", siteid);
			 var userid= site.get('userid');
            MM.panels.showLoading('center');
            
            if (MM.deviceType == "tablet") {
                MM.panels.showLoading('right');
            }
    
            var data = {
                "userids[0]" : userid 
            };
            
            MM.moodleWSCall('moodle_user_get_users_by_id', data, function(users) {   
			    var tpl = {users: users, deviceType: MM.deviceType,"user": users.shift()};
                var html = MM.tpl.render(MM.plugins.profile.templates.editprofile.html, tpl);
                MM.panels.show('center', html);  
			
            });
		
           },
		   
		 updateProfile: function() {
		  
			 var siteid=MM.config.current_site.id;
			 var site = MM.db.get("sites", siteid);
			 var userid= site.get('userid');
			MM.panels.showLoading('center');
			
			// Just updating constant email right now for all users
			
			var data =
			{
			"users[0][id]" : userid
			"users[0][email]" : 'anky@localhost.com',
			};
			// web service not working still finding the BUG
			/*
			MM.moodleWSCall('core_user_update_users', data, function(){
			   MM.popMessage(MM.lang.s("profileupdated"));  	  
			});
			*/
			
			  MM.popMessage(MM.lang.s("Not working still finding the BUG"));   
				MM.Router.navigate("profile/viewprofile");
				setInterval(location.reload(),3000);
				
				
			},
		   
		 templates: {
            "profile": {
			   model: "profile",
               html: profileTpl
           },
		    "editprofile": {
                html: profileTp2
           }
        }
	}
	  
    MM.registerPlugin(plugin);
});