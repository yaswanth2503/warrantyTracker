var path = '';

if (window.location.origin === "http://localhost:4040") {
	path = "http://localhost:8080";
} else {
	path = "https://backend-service-121438965080.asia-south1.run.app";
}
