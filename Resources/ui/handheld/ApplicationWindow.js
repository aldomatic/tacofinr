//Application Window Component Constructor

// Test URL: http://api.yelp.com/business_review_search?term=taco&lat=32.8790283203125&long=-96.77059173583984&radius=3&limit=3&ywsid=-sS9ARVeXV9ziC576Zkrtw&category=mexican
var radius = 1; // Set default search radius to 1 mile

function ApplicationWindow() {
	

	var serarchRadiusBtn = Titanium.UI.createButton({
		title:"1 Miles",
		backgroundColor:"#000"
	});
	

	//Here's the first window...
	var first = Ti.UI.createWindow({
	  backgroundColor:"#333",
	  fullscreen:true,
	  barColor: "#000",	  
	  barImage: "images/toolbarBg.png",
	  backgroundImage:"images/appBg.png",
	  tabBarHidden: true,
	  rightNavButton: serarchRadiusBtn
	});
	
	// Search Button
	var searchBtn = Ti.UI.createButton({
		top: 240,
		width: 258,
	    height: 102,
	    backgroundImage: "images/findBtn.png"
	});

	
/* 
	Radius Picker 
*/
var tr = Titanium.UI.create2DMatrix();
	tr = tr.rotate(90);

var picker_view = Titanium.UI.createView({
	height:251,
	bottom:-251,
	zIndex:2
});

var cancel =  Titanium.UI.createButton({
	title:'Cancel',
	style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
});

var done =  Titanium.UI.createButton({
	title:'Done',
	style:Titanium.UI.iPhone.SystemButtonStyle.DONE
});

var spacer =  Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});


var toolbar =  Titanium.UI.iOS.createToolbar({
	top:0,
	items:[cancel,spacer,done],
	barColor: "#000",
	backgroundImage:'images/toolbarBg.png'
});

var picker = Titanium.UI.createPicker({
		top:43
});
picker.selectionIndicator=true;

var picker_data = [
	Titanium.UI.createPickerRow({title:'1'}),
	Titanium.UI.createPickerRow({title:'2'}),
	Titanium.UI.createPickerRow({title:'3'}),
	Titanium.UI.createPickerRow({title:'4'}),
	Titanium.UI.createPickerRow({title:'5'}),
	Titanium.UI.createPickerRow({title:'6'}),
	Titanium.UI.createPickerRow({title:'7'}),
	Titanium.UI.createPickerRow({title:'8'}),
	Titanium.UI.createPickerRow({title:'9'}),
	Titanium.UI.createPickerRow({title:'10'})
];

picker.add(picker_data);

picker_view.add(toolbar);
picker_view.add(picker);



var slide_in =  Titanium.UI.createAnimation({bottom:0});
var slide_out =  Titanium.UI.createAnimation({bottom:-251});



serarchRadiusBtn.addEventListener('click',function() {
	picker_view.animate(slide_in);
});

cancel.addEventListener('click',function() {
	picker_view.animate(slide_out);
});


done.addEventListener('click',function() {
	radius = picker.getSelectedRow(0).title;
	serarchRadiusBtn.title = radius + " Miles";
	//alert(radius);
	picker_view.animate(slide_out);
});

first.add(picker_view);

//win1.open();




	/*
		End Radius Picker*
	*/	

	
	//var label = Ti.UI.createLabel({ text: "poke me to open the next window" });
	first.add(searchBtn); 
	 
	//Here's the nav group that will hold them both...
	var navGroup = Ti.UI.iPhone.createNavigationGroup({
	  window:first
	});
	 
	//Here's a window we want to push onto the stack...
	var second = Ti.UI.createWindow({
	  title:"Results",
	  barColor: "#000",
	  barImage: "images/toolbarBg.png"
	});
	//second.add(Ti.UI.createLabel({text:"Here's the child"}));
	 
	




	//When the label on the first window receives a touch, open the second
	searchBtn.addEventListener("click", function(e) {
		if (Ti.Geolocation.locationServicesEnabled) {
		    Titanium.Geolocation.purpose = 'Get Current Location';
    		Titanium.Geolocation.getCurrentPosition(function(e) {
		        if (e.error) {
		            Ti.API.error('Error: ' + e.error);
		        } else {
		            //Ti.API.info(e.coords);
		            pingYelp(e.coords.latitude, e.coords.longitude, radius);
		        }
		    });
		} else {
		    alert('Please enable location services');
		}
	});



	 
	//This is the main window of the application
	var main = Ti.UI.createWindow();
	main.add(navGroup);
	
	
	var locations, name, avatar, url, json, rating,
		rowData = []; 
		
	//Yelp call
	function pingYelp(lat, lng, radius){


		
	    var xhr = Ti.Network.createHTTPClient({
	    	onload: function(){
	    	
	    	json = JSON.parse(this.responseText);
	    	
	    	for(var i = 0; i < json.businesses.length; i++)
	    	{
	    		name = json.businesses[i].name;
	    		avatar = json.businesses[i].photo_url;
	    		url = json.businesses[i].mobile_url;
	    		rating = json.businesses[i].rating_img_url_small;
	    		
	    		var row = Titanium.UI.createTableViewRow({
	    			height:'auto',
	    			backgroundColor:"#fff",
	    			opacity: 0.0,
	    			selectedBackgroundColor:"orange",
	    			//hasDetail: true,
	    			mobileUrl: url,
	    			name: name
	    		});

	    		var hasDetailImage = Ti.UI.createImageView({
	    			height:26,
	    			width:23,
	    			right:15,
	    			top:15,
	    			image:"images/arrow.png"
	    		});
	    		row.add(hasDetailImage);
	    		
	    		
				// Create the view that will contain the text and avatar
				var post_view = Titanium.UI.createView({
					height:'size', 
					layout:'vertical',
					top:5,
					right:5,
					bottom:5,
					left:5,
					backgroundColor: "transparent"
				});
				
				// Create image view to hold profile pic
				var av_image = Titanium.UI.createImageView({
					image:avatar, // the image for the image view
					top:5,
					left:5,
					height:100,
					width:100
				});
				//post_view.add(av_image);
				
				// Create the label to hold the screen name
				var user_lbl = Titanium.UI.createLabel({
					text:name,
					left:10,
					width:300,
					top:5,
					bottom:5,
					height:'40',
					textAlign:'left',
					verticalAlign: 'top',
					color:'#000',
					font:{fontFamily:'Arial',fontSize:17,fontWeight:'bold'}
				});
				post_view.add(user_lbl);
				
				// Create image view to hold rating
				var rating_image = Titanium.UI.createImageView({
					image:rating, // the image for the image view
					top:5,
					left:115,
					height:10,
					width:50
				});
				//post_view.add(rating_image);

				



				
				// Add the post view to the row
				row.add(post_view);
				// Give each row a class name
				row.className = "item"+i;
				// Add row to the rowData array
				rowData[i] = row;	
	    	}
	    	
	    	// Create the table view and set its data source to "rowData" array
			var tableView = Titanium.UI.createTableView({
					data:rowData,
					backgroundColor:"#000w",
					separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.SINGLE_LINE,
					sepertorColor:"#000"				
				});
				
				tableView.addEventListener('click', function(e) {
				    //console.log(e.rowData.mobileUrl);
				    var webview = Titanium.UI.createWebView({url:e.rowData.mobileUrl});
				    
				    var win = Titanium.UI.createWindow({
				    		title:e.rowData.name,
				    		barImage: "images/toolbarBg.png",
				    		barColor: "#000"
				    });

				    var b = Titanium.UI.createButton({
				    	title:'Back',
				    	style: Titanium.UI.iPhone.SystemButtonStyle.DONE
				    });

				     win.leftNavButton = b;
				        b.addEventListener('click', function(){
				        win.close();
				      });

				    win.add(webview);
				    win.open({modal:true});
				});
				
			//Add the table view to the window
			second.add(tableView);
			navGroup.open(second);	
	    			
	    	},
	    	onerror: function(e){
			    alert('There was an error retrieving the remote data. Try again.');
			},
		    timeout:5000
	    });
	    
	    xhr.open("GET", 'http://api.yelp.com/business_review_search?term=taco&lat='+lat+'&long='+lng+'&radius='+radius+'&limit=35&ywsid=-sS9ARVeXV9ziC576Zkrtw&category=mexican');


		xhr.send();
	    
		}
		
		
		
	
	return main;
	
}	
module.exports = ApplicationWindow;




