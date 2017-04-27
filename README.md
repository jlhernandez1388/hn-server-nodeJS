# Web project template
The main goal of this repo is to provide a great starting point for web projects. We expect this to evolve over time to reflect changes in technologies and approaches.

## Getting started
- `git clone git@github.com:GetBlimp/web-project-template.git name-of-new-project`
- `cd name-of-new-project`
- `yarn install`
- `cp .env.sample .env` - update file with local values

### Running in development
- `npm run watch`
- Open [http://127.0.0.1:5000](http://127.0.0.1:5000)

### Running in production
- `npm start`

## Folder structure
- `app/index.js` - This is the entry point for the server.
- `app/routes` - Here we define our application routes.
- `app/views` - All server rendered templates go here. We use Handlebars templates.
- `app/utils` - This directory is for general purpose functions. Files in this directory can be imported from the `app/public/js` directory for inclusion in the client side build.
- `app/public` - All client side files live here.
- `app/public/bundle.js` - This is the entry point for WebPack. Here we have to import / require all files we want WebPack to process. What happens to files once loaded is configured in `webpack.config.js`.
- `app/public/js/index.js` - This file exports a function that's executed once the page is loaded. Application code should start form here. All JS files are linted with eslint and then compiled using Babel.
- `app/public/img` - All image files should live here. Putting image files here ensures they get optimized using imagemin.
- `app/public/css` - All styles should be defined here using the Stylus language. All Stylus files should use colons, semi-colons, commas and braces.

## Features
- Express.js server with common middlewares
- Handlebars templates with layouts and partials
- Webpack build for all static assets
- ES2015 JavaScript with Babel.js
- JavaScript linting using eslint with eslint-config-blimp
- Stylus CSS preprocessor with autoprefixer and normalize.css
- Image optimization via gifsicle, jpegtran, optipng, svgo and pngquant
- LiveReload server during development

## Docs
- [express.js](https://expressjs.com/en/4x/api.html)
- [Handlebars](http://handlebarsjs.com/)
- [Stylus](http://stylus-lang.com/)
