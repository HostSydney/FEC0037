var platform_block_redirect = "https://www.federationcentres.com.au";

var platform_safari = (!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/));

var platform_iexplore = (navigator.userAgent.indexOf("MSIE") != -1 || navigator.userAgent.indexOf("Trident/7.0") != -1);

var platform_iexplore_version_check = /MSIE ([0-9]{1,}[.0-9]{0,})/g;

var platform_iexplore_version = platform_iexplore_version_check.exec(navigator.userAgent);

if (platform_iexplore_version != null) {

	platform_iexplore_version = parseFloat(platform_iexplore_version[1]);

	if (!isNaN(platform_iexplore_version) && platform_iexplore_version < 9) {

		window.location = platform_block_redirect;

	}

}
else {

	platform_iexplore_version = 0;

}


$.str_pad=function(str, str_len, str_fill){
	str = str.toString();

	while (str.length < str_len) {
		str = str_fill + str;
	}

	return str;

}

$.validators={
	email: /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
	phone: /^(?=\S{10,})(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i
}


$(document).ready(function () {


	if (platform_safari) {

		$("html").addClass("platform-safari");

	}


	if (platform_iexplore) {

		$("html").addClass("platform-iexplore");

	}

	if (platform_iexplore_version != 0) {

		$("html").addClass("platform-iexplore" + "-" + platform_iexplore_version);

	}



	var masking_split = navigator.userAgent.toLowerCase().split(" ");
	masking_split = masking_split.filter(function (obj) { if (obj.indexOf("chrome") != -1) { return true } });
	masking_split = (masking_split.length == 1 && parseInt(masking_split[0].split("/")[1]) >= 24);

	if (masking_split) {

		$("html").addClass("masking");

	}


	var fed_wrapper = $("#wrapper");

	var fed_header = $(".header");

	var fed_pages = $(".pages");

	var fed_personality_bank = $(".personality_bank");

	var fed_questions_bank = $(".questions_bank");
	var fed_pages_window = $(".pages_window");





	var fed_breakpoints_active = function (fed_breakpoints_name) {

		return $(".breakpoints_bank").children(".breakpoints_bank-" + fed_breakpoints_name).is(":visible");

	};



	var fed_questions_active = 0;

	var fed_questions_increment = 0;

	var fed_questions_timer;
	var fed_questions_timer_duration = 750;
	var fed_questions_timer_safe = 15;

	var fed_questions_locked = false;

	var fed_masking_timer;

	function fed_questions_set(fed_questions_new, fed_questions_results) {

		var fed_questions_this;

		var fed_wrapper_results = (fed_wrapper[0].className.indexOf("results_") == 0);

		if (typeof(fed_questions_results) != "undefined") {

			fed_questions_new = fed_questions_bank.children().length + 1;

			var fed_questions_results_winner = fed_questions_results[0].name;

			fed_questions_results_winner = data.personality[fed_questions_results_winner];

			fed_questions_this = $(".page_results-" + fed_questions_results_winner.stub).clone();



			fed_questions_this.find("form").find("input, textarea").filter(":visible").each(function () {

				$(this).val("");

			});

			if ($("html").hasClass("platform-iexplore-9")) {

				fed_questions_this.find("form").find("input, textarea").filter(":visible").each(function () {

					$(this).val($(this).attr("placeholder"));

				});

			}


			fed_questions_this.find("form").find("input, textarea").each(function () {

				$(this).attr("id", $(this).attr("name").split(" ").join(""));

				var this_limit_words = parseInt($(this).attr("data-validate-wordlimit"));

				if (!isNaN(this_limit_words)) {

					var this_label = fed_questions_this.find("form").find("label[for=" + $(this).attr("name") + "]");

					$(this).on("input", function () {

						var this_content = $(this).val();

						var this_content_words = this_limit_words;

						this_content = this_content.trim();
						this_content = this_content.replace(/\s\s+/g, ' ');

						if (this_content != "") {

							this_content = this_content.split(" ");

							this_content_words -= this_content.length;

						}

						if (this_content_words >= 0) {

							this_label.find("value").html(this_content_words);

							this_label.find("valuedescriptor").html(" word" + (this_content_words != 1 ? "s" : "") + " remaining");

							$(this).removeClass("_data-validate-wordlimit_over");

						}
						else {

							this_content_words = -this_content_words;

							this_label.find("value").html(this_content_words);

							this_label.find("valuedescriptor").html(" word" + (this_content_words != 1 ? "s" : "") + " over limit");

							$(this).addClass("_data-validate-wordlimit_over");

						}

					});

					$(this).trigger("input");

				}

			});

			var this_field_invalid_class = "_data-form-field-invalid";

			fed_questions_this.find("form").find("input, textarea").on("input click", function () {

				$(this).removeClass(this_field_invalid_class);

			});

			fed_questions_this.find("form").find(".form-button > .fed_button").on("click", function () {

				var this_form_valid = true;

				fed_questions_this.find("form").find("input, textarea").each(function () {

					if ($(this).attr("data-form-required") == "true") {

						var this_field_valid = true;

						if ($(this).attr("type") == "checkbox") {

							this_field_valid &= $(this).prop("checked");

						}
						else {

							var this_field_content = $(this).val().trim();

							this_field_valid &= (this_field_content != "");

							if ($(this).attr("data-validate-format") != undefined) {

								var this_field_content_validator = $.validators[$(this).attr("data-validate-format")];

								if (this_field_content_validator != undefined) {

									this_field_valid &= (this_field_content_validator.exec(this_field_content) != null);

								}
							}

						}

						this_field_valid &= (!($(this).hasClass("_data-validate-wordlimit_over")));

						if (this_field_valid) {

							$(this).removeClass(this_field_invalid_class);

						}
						else {

							$(this).addClass(this_field_invalid_class);

						}

					}

				});

				if (fed_questions_this.find("form").find("input, textarea").filter("." + this_field_invalid_class).length == 0) {

					var this_form_destination = fed_questions_this.find("form").attr("action");

					var this_form_data = fed_questions_this.find("form").serialize();

					$.post(this_form_destination, this_form_data, function (data) {

						console.log(data);

						window.form_data = data;

					});
				
					fed_questions_this.find("form").find("row").not(".form-success").remove();

					fed_wrapper.addClass("results_form_success");

					$(window).trigger("resize");

				}

			});

			fed_wrapper[0].className = "results_" + fed_questions_results_winner.stub;

		}
		else
		{

			fed_questions_new = parseInt(fed_questions_new);

			if (isNaN(fed_questions_new)) {
				return;
			}

			if (fed_questions_bank.children().eq(fed_questions_new - 1).length == 0) {
				return;
			}

			if (fed_questions_timer != undefined) {

				return;

			}

			if (fed_questions_new == fed_questions_active) {

				return;

			}


			var fed_questions_match = fed_questions_new - 1;

			fed_questions_this = fed_questions_bank.children().eq(fed_questions_match).clone();

			if (fed_questions_this.attr("data-question-answer") != undefined) {

				fed_questions_this.find(".questions_gallery").children().eq(fed_questions_this.attr("data-question-answer")).addClass("questions_gallery_option_selected");

			}

			fed_wrapper[0].className = "questions_" + $.str_pad(fed_questions_new, 2, "0");

		}

		var fed_wrapper_results_now = (fed_wrapper[0].className.indexOf("results_") == 0);



		fed_questions_increment ++;

		fed_questions_this.css("z-index", (20 + fed_questions_increment));



		if (fed_questions_active != 0) {

			clearTimeout(fed_masking_timer);
			fed_masking_timer = setTimeout(function () {
				if ($("html").hasClass("masking")) {

					$("html").toggleClass("masking_alternate");
				
				}

			}, fed_questions_timer_duration * 0.75);

			if (fed_questions_new < fed_questions_active) {

				fed_questions_this.addClass("page-above");

			}
			else if (fed_questions_new > fed_questions_active) {

				fed_questions_this.addClass("page-below");

			}


			setTimeout(function () {

				fed_questions_this.removeClass("page-above");
				fed_questions_this.removeClass("page-below");

				setTimeout(function () {

					if (!fed_pages_window.children().first().is(fed_questions_this)) {

						fed_pages_window.children().first().remove();

					}

					if (fed_pages_window.children().first().is(fed_questions_this)) {

						fed_questions_this.addClass("page-landed");

						fed_questions_locked = false;

					}

				}, fed_questions_timer_duration);

			}, fed_questions_timer_safe);


		}
		else {

			fed_questions_this.addClass("page-landed");

		}



		setTimeout(function () {

			$(window).trigger("resize");

		}, fed_questions_timer_safe + fed_questions_timer_duration + 1);


		fed_pages_window.append(fed_questions_this);

		fed_questions_this.show();





		fed_questions_active = fed_questions_new;

		$(window).trigger("fed_questions_reload");


	}





	$(window).on("load resize orientationchange", function () {

		var fed_pages_height = fed_wrapper.outerHeight();

		fed_pages_height -= Math.ceil($(".global_measure > div").outerHeight(true));
		fed_pages_height -= Math.ceil($(".header_measure > div").outerHeight(true));

		if ($(".pages_window > .page_results > .page_dynamic").length > 0) {

			fed_pages_height = $(".pages_window").children(".page_results").children(".page_dynamic").height();

			fed_wrapper.addClass("results_form");
			
		}
		else {

			fed_wrapper.removeClass("results_form");

		}


		fed_pages.css("height", fed_pages_height + "px");

	});

	$(window).on("load", function () {

		$.getJSON("bank.json", function (data) {

			window.data = data;

			fed_questions_bank.children().remove();

			var personality_source = $("#personality-template").html();
			var personality_template = Handlebars.compile(personality_source);

			var personality_template_data = personality_template(data);

			fed_personality_bank.append(personality_template_data);


			var questions_source = $("#questions-template").html();
			var questions_template = Handlebars.compile(questions_source);

			var questions_template_data = questions_template(data);

			questions_template_data = $(questions_template_data).filter("div");
			questions_template_data.each(function (ind) {

				$(this).find("h1").text((ind + 1).toString());

				$(this).addClass("questions_" + $.str_pad((ind + 1), 2, "0"));

				$(this).attr("data-question-id", (ind + 1));

			});

			fed_questions_bank.append(questions_template_data);

			$(window).on("fed_questions_reload", function () {

				var fed_questions_this = fed_pages_window.children().last();

				var fed_questions_this_id = fed_questions_this.attr("data-question-id");

				var fed_questions_this_children = fed_questions_this.find(".questions_gallery").children();

				fed_questions_this_children.each(function (ind) {

					$(this).on("click", function (event) {

						if (!($("html").hasClass("platform-iexplore-9"))) {

							if (fed_questions_locked) {

								return;

							}

							fed_questions_locked = true;

						}


						fed_questions_this_children.not($(this)).removeClass("questions_gallery_option_selected");

						$(this).addClass("questions_gallery_option_selected");


						var fed_questions_this_bank = fed_questions_bank.children().filter(function () {

							if ($(this).attr("data-question-id") == fed_questions_this_id) {
								return true;
							}

						});

						fed_questions_this_bank.attr("data-question-answer", ind);



						var fed_questions_this_remaining = fed_questions_bank.children().filter(function () {

							if ($(this).attr("data-question-answer") == undefined) {
								return true;
							}

						});

						if (fed_questions_this_remaining.length != 0) {

							var fed_questions_this_next = fed_questions_this_remaining.first().attr("data-question-id");

							fed_questions_set(fed_questions_this_next);

						}
						else {

							var results = Array();

							fed_questions_bank.children().not(fed_questions_this_remaining).each(function (ind) {

								var results_this = parseInt($(this).attr("data-question-answer"));

								results_this = data.bank[ind].answers[results_this].personality;

								for (var results_this_item in results_this) {

									results_this_item = results_this[results_this_item];

									if (results[results_this_item] == undefined) {

										results[results_this_item] = 0;

									}

									results[results_this_item] ++;

								}

							});


							var results_clean = Array();

							for (var results_this in results) {

								results_clean.push({
									"name": results_this,
									"score": results[results_this]
								});

							}

							results_clean.sort(function (a, b) {

								return b.score - a.score;

							});

							results = results_clean;

							fed_questions_set(-1, results);

						}

						if (fed_breakpoints_active("tablet")) {

							$('html, body').animate({ scrollTop: 0 }, 250);

						}

					});

				});

			});



			$(".hero_start").on("click", function () {

				$(".global_restart > a").on("click", function () {

					if ($(this).is(":visible")) {

						window.location = window.location.href;

					}

				});
				
				$('html, body').animate({ scrollTop: 0 }, 250);

				$(this).fadeOut(fed_questions_timer_duration);

				$("html").removeClass("waiting");

				$(".pages_landing").fadeOut(fed_questions_timer_duration);

				fed_questions_set(1);

			});



			var centres_data_stub = document.domain.split(".com")[0].split(".").slice(-1);

			if (typeof(data.centres[centres_data_stub]) == "undefined") {

				$("html").addClass("centres-" + "generic");

			}
			else {

				$("html").addClass("centres-" + centres_data_stub);


				var centres_data = data.centres[centres_data_stub];

				$(".global").find("a").attr("href", "//" + centres_data_stub + ".com.au");

				if (typeof(centres_data.facebook) != "undefined") {

					$(".form-share-facebook a").attr("href", "https://www.facebook.com/" + centres_data.facebook);

				}

				$(".form-hidden input[name='Property Code']").val(centres_data.property_code);

			}

		});

	});



});