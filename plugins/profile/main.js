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
			
			//	if (MM.deviceType == "tablet") {
               //     MM.plugins.profile.editProfile(userid);
             //   }
			
            }); 
        
		   },
		editProfile: function() {
			 var siteid=MM.config.current_site.id;
			 var site = MM.db.get("sites", siteid);
			 var userid= site.get('userid');
			 
           MM.panels.showLoading('center');
            
         //   if (MM.deviceType == "tablet") {
           //     MM.panels.showLoading('right');
          //  }
    
            var data = {
                "userids[0]" : userid 
            };
            
            MM.moodleWSCall('moodle_user_get_users_by_id', data, function(users) {    // local_usersget_getuser_by_id 
			    var tpl = {users: users, deviceType: MM.deviceType,"user": users.shift()};
                var html = MM.tpl.render(MM.plugins.profile.templates.editprofile.html, tpl);
                MM.panels.show('right', html);  
			
            });
		
           },
		   
		 updateProfile: function() {
			
		// alert("updateprofile");
		  
			 var siteid=MM.config.current_site.id;
			 var site = MM.db.get("sites", siteid);
			 var userid= site.get('userid');
			MM.panels.showLoading('center');
			var data =
			{
			"users[0][id]" : userid,
			//"users[0][email]" : 'anky@localhost.com',
			/*
			"users[0][username]": string
			"users[0][password]":string
			"users[0][firstname]": string
			"users[0][lastname]": string
			"users[0][email]": string
			"users[0][auth]": string
			"users[0][idnumber]": string
			"users[0][lang]": string
			"users[0][theme]": string
			"users[0][timezone]": string
			"users[0][mailformat]": int
			"users[0][description]": string
			"users[0][city]": string
			"users[0][country]": string
			"users[0][customfields][0][type]": string
			"users[0][customfields][0][value]": string
			"users[0][preferences][0][type]": string
			"users[0][preferences][0][value]": string				
			*/
			};
			// web service not working still finding the BUG
			MM.moodleWSCall('moodle_user_update_users', data, function(){
			  alert("ho gaya");
			  // MM.popMessage(MM.lang.s("profileupdated"));  	  
			});
			//alert("Not working still finding the BUG Click OK to Redirect ");
			//navigator.app.exitApp();
			//	MM.Router.navigate("profile/viewprofile");
				//setInterval(location.reload(),3000);
				
				
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