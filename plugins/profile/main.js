var templates = [
    "root/externallib/text!root/plugins/profile/profile.html",
];

define(templates,function (profileTpl) {
    var plugin = {
        settings: {
            name: "profile",
            type: "general",
            subMenus: [
                {name: "viewprofile", menuURL: "#profile/viewprofile", icon: "plugins/profile/profile.png"},
              
            ],
            lang: {
                component: "core"
            }
        },
         storage: {
          profile: {type: "model"}
       },
        routes: [
            ["profile/viewprofile", "profile", "showProfile"],	
            
        ],
      showProfile: function() {
			  
            MM.panels.showLoading('center');
            
            if (MM.deviceType == "tablet") {
                MM.panels.showLoading('right');
            }
    
            var data = {
                "userids[0]" : 2 
            };
            
            MM.moodleWSCall('moodle_user_get_users_by_id', data, function(users) {
			//alert("hello");
			
                var tpl = {users: users, deviceType: MM.deviceType,"user": users.shift()};
                var html = MM.tpl.render(MM.plugins.profile.templates.profile.html, tpl);
                MM.panels.show('center', html);
                
            });
           },
		
		 templates: {
            "profile": {
                model: "profile",
               html: profileTpl
           },
       }
	}
	 
 
    MM.registerPlugin(plugin);
});