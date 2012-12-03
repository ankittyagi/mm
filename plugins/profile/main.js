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
			//subMenus: [
              //  {name: "viewprofile", menuURL: "#profile/viewprofile", icon: "plugins/profile/profile.png"},
             // {name: "editprofile", menuURL: "#profile/editprofile", icon: "plugins/profile/profile.png"},
              
         //   ],
            lang: {
                component: "core"
            }
        },
         storage: {
          profile: {type: "model"},
		  editprofile: {type: "collection", model: "profile"}
       },
        routes: [
            ["profile/viewprofile", "profile", "showProfile"],	
            ["profile/editprofile", "profile", "editProfile"],	
        ],
      showProfile: function() {
			
            MM.panels.showLoading('center');
            
            if (MM.deviceType == "tablet") {
                MM.panels.showLoading('right');
            }
    
            var data = {
                "userids[0]" : 2 
            };
            
            MM.moodleWSCall('moodle_user_get_users_by_id', data, function(users) {    // local_usersget_getuser_by_id 
			    var tpl = {users: users, deviceType: MM.deviceType,"user": users.shift()};
                var html = MM.tpl.render(MM.plugins.profile.templates.profile.html, tpl);
                MM.panels.show('center', html);  
			
            }); 
           },
		editProfile: function() {
		//alert("editprofile");
		
            MM.panels.showLoading('center');
            
            if (MM.deviceType == "tablet") {
                MM.panels.showLoading('right');
            }
    
            var data = {
                "userids[0]" : 2 
            };
            
            MM.moodleWSCall('moodle_user_get_users_by_id', data, function(users) {    // local_usersget_getuser_by_id 
			    var tpl = {users: users, deviceType: MM.deviceType,"user": users.shift()};
                var html = MM.tpl.render(MM.plugins.profile.templates.editprofile.html, tpl);
                MM.panels.show('center', html);  
			
            });
		
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