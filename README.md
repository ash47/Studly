# ReadMe

## Setting up development Environment
The following components must be installed in order to get the solution running

- Latest [NodeJs](http://nodejs.org/)
- [Yeoman](http://yeoman.io/) - which is used for scaffolding and workflow, installing yeoman will automatically install [grunt](http://gruntjs.com/) and [bower](http://bower.io/)

All of the above are available as NPM modules

## Running the application locally

After installing the required libraries above browse to pheets and run bower install and npm install to get all dependencies

	  bower install && npm install.

After installation run grunt to view development version of the website

	grunt serve


To start production ready website

  grunt serve:dist

## Adding libraries

Bower should be used for adding new libraries when possible, always remember to run bower with the --save-dev tag to update the bower.json file


	 bower install libraryname#verion_number --save-dev

## Getting node.js dependencies
 - There should be a `package.json` in each of the node.js directories (at this stage, only dataFinders)
 - CD to the directory (etc: dataFinders)
 - type `npm install`
 - This will look at the `package.json` file, which will tell npm what it needs to download

###About###
Studly is an app that allows students to keep track of which lectures and tutorials that have attended, as well as allowing them easy access to lecture recordings, directions to classes and more.

###Features###
 - Easy timetable management
 - Keeping track of what you've been to

###Technologies###
 - [Yeoman](http://yeoman.io/)
  - A way to generate a boilerplate AngularJS App with associated unit tests and requirements, like Bootstrap.
 - [Angular JS](http://angularjs.org/)
  - A Javascript frontend framework
 - [Sass](http://sass-lang.com/)
  - CSS preprocessor that adds functions and variables
 - [Node.js](http://nodejs.org/)
  - Server backend powered by google's V8 engine (what chrome uses for javascript)
 - [Express.js]
  - A Server-Side MVC Framework. Works very nicely with Node.js
 - [Herohu](https://www.heroku.com/)
  - A place to deploy our server for free
 - [Karma Runner](http://karma-runner.github.io/0.12/index.html)
  - A javascript test runner for webapps (focussing on angularjs)
 - [Bootstrap](http://getbootstrap.com/)
  - A Front-End framework for developing responsive webapps, CSS Framework
