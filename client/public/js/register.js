$(document).ready(function () {
	$("#regForm").submit(function (e) {
		e.preventDefault();

		console.log("form submitted");
		const formData = {
			firstName: $("input[name='firstName']").val(),
			lastName: $("input[name='lastName']").val(),
			username: $("input[name='username']").val(),
			email: $("input[name='email']").val(),
			password: $("input[name='password']").val()
		};

		$.ajax({
			url: `${path}/api/users/register`,
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify(formData),

			success: function (response) {
				window.location.href = response.redirectUrl;
			},

			error: function (xhr) {
				alert(xhr.responseJSON.error);
			}
		});

	});

});