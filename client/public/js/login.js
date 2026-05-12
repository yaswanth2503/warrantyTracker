$(document).ready(function () {
	$("#loginForm").submit(function (e) {
		e.preventDefault();

		const formData = {
			username: $("input[name='username']").val(),
			password: $("input[name='password']").val()
		};

		$.ajax({
			url: `${path}/api/users/login`,
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify(formData),
			success: function (response) {
				alert("Login successful");
				window.location.href = "/dashboard";
			},
			error: function (xhr) {
				alert("Login failed");
			}
		});

	});

});