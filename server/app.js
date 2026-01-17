const express = require('express');
const path = require("path");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const compression = require('compression');
const routes = require('./routes');
const env = process.env.NODE_ENV || "development";

const app = express();

app.set("views", path.join(__dirname, "../client/views"));
app.set('view engine', 'pug');

app.use(morgan("dev"));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../client/public")));
app.use('/', routes);

app.use((req, res, next) => {
    return res.status(404).render("error", { title: 'Error', message: 'Page not found' })
})

// Error handling
app.use((err, req, res, next) => {
	const statusCode = err.status || 500;
	const message = err.message || "Internal Server Error";
    if (env == 'development') {
        res.status(statusCode).render("error", {
            statusCode,
            message,
            error: err
        });
    } else {
        res.status(statusCode).render("error", {
            statusCode,
            message
        });
    }

});

module.exports = app;