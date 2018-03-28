var storeStreams = [
	"ESL_SC2",
	"OgamingSC2",
	"cretetion",
	"freecodecamp",
	"storbeck",
	"habathcx",
	"RobotCaleb",
	"noobs2ninjas"
]; // list of streamers
var state = "all"; // status of streamers

$("#sidebar").affix({
	offset: {
		// affix top position
		top: function() {
			return this.top;
		}
	}
});

// Get Twitch info through API
function getInfo(state) {
	storeStreams.forEach(function(channel) {
		function makeURL(type, name) {
			// users, channels, or streams
			return (
				"https://wind-bow.gomix.me/twitch-api/" + type + "/" + name + "?callback=?"
			);
		}
		$.getJSON(makeURL("streams", channel), function(data) {
			var game, status;
			if (data.stream === null) {
				game = "Offline";
				status = "offline";
			} else {
				game = data.stream.game;
				status = "online";
			}
			$.getJSON(makeURL("channels", channel), function(data) {
				var description = status === "online" ? ": " + data.status : "",
					name = data.display_name != null ? data.display_name : channel,
					logo =
						data.logo != null
							? data.logo
							: "http://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png";
				html =
					'<div class="row ' +
					status +
					'"><div class="col-sm-2" id="icon"><img src="' +
					logo +
					'" class="logo"></div><div class="col-sm-3" id="name"><a href="' +
					data.url +
					'" target="_blank">' +
					name +
					'</a></div><div class="col-sm-7" id="streaming">' +
					game +
					"<span>" +
					description +
					"</span></div></div>";
				if (status === state || state === "all") {
					status === "online"
						? $("#streamers").prepend(html)
						: $("#streamers").append(html);
				}
			});
		});
	});
}

// Search and add a new streamer
$(".search").submit(function(event) {
	event.preventDefault();
	var keyword = $("#trigger").val();
	if (keyword !== "") {
		storeStreams.push(keyword);
		$("#streamers").html("");
		getInfo(state);
	}
});

$(document).ready(function() {
	getInfo(state);
	$(".selector").click(function() {
		$(".selector").removeClass("active");
		$(this).addClass("active");
		state = $(this)[0].id;
		$("#streamers").html("");
		getInfo(state);
	});
});
