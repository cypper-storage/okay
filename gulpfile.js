const gulp = require('gulp');
const browserify = require('gulp-browserify');
const banner = require('gulp-banner');
const color = require('gulp-color');
const jshint = require('gulp-jshint');
const qunit = require('node-qunit-phantomjs');
const server = require('gulp-server-livereload');
const map = require('map-stream');
const fs = require('fs');
const through2 = require('through2');
const uglify = require('gulp-uglifyjs');
const git = require('gulp-git');
const prettify = require('gulp-js-prettify');
const exec = require('child_process').exec;
const watcher = require("cypper-gulp-watcher");
const Combine = require('stream-combiner');

const pkg = require('./package.json');
pkg.jshint.strict = pkg.options.strict;

const colorfull = (number=0,str='') => '\x1b['+number+'m'+str+'\x1b[0m';
const customLog = (str) => console.log(log = colorfull(36,"-")+"["+colorfull(90,now())+"] " + str);
const now = () => {
	let date = new Date();
	date = +date - date.getTimezoneOffset()*60*1000;
	return new Date(date).toISOString().replace(/T/, ' ').replace(/\..+/, '').substr(-8);
}

const comment = `/*\n
	 * <%= pkg.name %> <%= pkg.version %>
	 * <%= pkg.description %>
	 * <%= pkg.homepage %>
	 *
	 * Copyright 2015, <%= pkg.author %>
	 * Released under the <%= pkg.license %> license.
	*/\n\n`;

if (!pkg.options) {
	throw "Options is not defined in package.json";
}

gulp.task('test', () => {
	qunit('./dist/test/test.html');
});

const jshintCheck = (onSuccess) => {
	let error = false;
	const captureJshintError = map((file, cb) => {
		if (file.jshint.data)
			for(let chunk of file.jshint.data)
				for(let chunkError of chunk.errors)
					if (chunkError.code.startsWith("E"))
						error = true;
		cb(null, file);
	});

	let scrJsFS = gulp.src('src/**/*.js')
	if (pkg.options.strict) {
		let changed = false;
		scrJsFS = scrJsFS.pipe(through2.obj((chunk, enc, cb) => {
			const strictStr = `"use strict";`;
			let file = chunk.contents.toString(enc);
			if (!file.startsWith(strictStr)) {
				chunk.contents = Buffer.from(strictStr+"\n\n"+file, enc);
				if (watcher.watchers['global']) watcher.pause('global');
				fs.writeFile(chunk.path, chunk.contents, (err) => {
					if (err) throw err;
					customLog(color("strict","MAGENTA")+" added to "+chunk.path);
					if (watcher.watchers['global']) watcher.start('global');
					cb(null,chunk);
				});
			} else {
				cb(null,chunk);
			}
		}))
	}

	scrJsFS
		.pipe(jshint(pkg.jshint))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(captureJshintError)
		.on('end', ()=> {
			if (!error) onSuccess();
		})
};
const deploy = () => {
	let mainJsFS = gulp.src('src/main.js');

	mainJsFS = mainJsFS.pipe(browserify({
		insertGlobals : true,
	}))
	mainJsFS.on('error', (err) => {
		console.log(color(err.message,"red"));
		console.log(color(err.stack,"red"));
	})

	if (pkg.options.uglify) mainJsFS = mainJsFS.pipe(uglify())
	if (pkg.options.prettify) {
		mainJsFS = mainJsFS.pipe(prettify({
			collapseWhitespace: true,
			indent_with_tabs: true,
			indent_size: 1,
			jslint_happy: true,
			preserve_newlines: false
		}))
	}
	if (pkg.options.banner) mainJsFS = mainJsFS.pipe(banner(comment, {pkg: pkg}))


	mainJsFS
		.pipe(gulp.dest('dist'))
		.pipe(through2.obj((chunk, enc, cb) => {
			customLog(color("browserified","green"));
		}))
	
}


// BROWSER APP CREATION

const browser = () => {
	 gulp.src("dist")
		.pipe(server({
			livereload: true,
			open: true,
			directoryListing: {
				enable:true,
				path: 'dist'
			},
			port: 1114
		}))
};
var execNodeScript = (file) => {
	exec('node '+file, (err, stdout, stderr) => {
		if (stdout) console.log(stdout);
		if (stderr) console.log(color(stderr,"red"));
	});
}
const nodeExecute = () => {
	execNodeScript("src/main.js");
};

// BROWSERIFY, UGLIFY, BABELIFY + livereload

gulp.task('browser', () => {
	jshintCheck(deploy);
})
gulp.task('browserW', ['browser'], () => {
	browser();
	watcher
		.create('global', 'src/**', ['browser'])
		.start('global');
});

// BROWSERIFY, UGLIFY, BABELIFY

gulp.task('browserify', () => {
	jshintCheck(deploy);
})
gulp.task('browserifyW', ['browserify'], () => {
	watcher
		.create('global', 'src/**', ['browserify'])
		.start('global');
});

// NODE JS EXEC

gulp.task('node', () => {
	jshintCheck(nodeExecute);
});
gulp.task('nodeW', ['node'], () => {
	watcher
		.create('global','src/**', ['node'])
		.start('global');
});


// NODE and BROWSER

gulp.task('nodeAndBrowser', () => {
	jshintCheck(()=> {
		nodeExecute();
		deploy();
	});
})
gulp.task('nodeAndBrowserW', ['nodeAndBrowser'], ()=> {
	browser();
	watcher
		.create('global', 'src/**', ['nodeAndBrowser'])
		.start('global');
});

// GITHUB

const gitBranch = pkg.options.git.branch;
const gitCwd = pkg.options.git.cwd;
const gitFiles = pkg.options.git.files;
const gitRemote = pkg.options.git.remote;
const gitCommitMessage = pkg.options.git.commitMessage;
const gitOpt = {
	cwd:gitCwd
};

// GIT WATCHER

gulp.task('git', () => {
	add(()=>commit(()=>push()));
});
gulp.task('gitW', ['git'], () => {
	watcher
		.create('global',gitFiles, ['git'])
		.start('global');
});

gulp.task('gitConnect', () => {
	init(()=>add(()=>addremote()));
});


const init = (cb=()=>{}) => {
	customLog("init start");
	git.init(gitOpt,(err) => {
		if (err) throw err;
		customLog("init end");
		cb();
	});
}
gulp.task('gitInit', ()=>init());

const add = (cb=()=>{}) => {
	customLog("add "+gitCwd+" start");
	gulp.src(gitFiles)
		.pipe(git.add(gitOpt))
		.on("end", () => {
			customLog("add "+gitCwd+" end");
			cb();
		});
}
gulp.task('gitAdd', ()=>add());

const addremote = (cb=()=>{}) => {
	customLog("addremote "+gitRemote+" start");
	git.addRemote('origin', gitRemote, gitOpt, (err) => {
		if (err) throw err;
		customLog("addremote "+gitRemote+" end");
		cb();
	});
}
gulp.task('gitAddremote', ()=>addremote());

const checkout = (cb=()=>{}) => {
	customLog("checkout -b to "+gitBranch+" start");
	git.checkout(gitBranch, Object.assign({
		args: '-b'
	},gitOpt), (err) => {
		if (err) throw err;
		customLog("checkout -b to "+gitBranch+" end");
	});
}
gulp.task('gitCheckout', ()=>checkout());

const commit = (cb=()=>{}) => {
	customLog("commit start");
	return gulp.src(gitCwd + '/**')
		.pipe(git.commit(gitCommitMessage, gitOpt))
		.on("end", () => {
			customLog("commit end");
			cb();
		});
}
gulp.task('gitCommit', ()=>commit());

const push = (cb=()=>{}) => {
	customLog("push to "+gitBranch+" start");
	git.push('origin', gitBranch, gitOpt,(err) => {
		if (err) throw err;
		customLog("push to "+gitBranch+" end");
		cb();
	});
}
gulp.task('gitPush', ()=>push());

const merge = () => {
	git.merge(gitBranch, gitOpt, (err) => {
		if (err) throw err;
	});
}
gulp.task('gitMerge', ()=>merge());


const fetch = () => {
	git.fetch('origin', gitBranch, gitOpt, (err) => {
		if (err) throw err;
	});
}
gulp.task('gitFetch', ()=>fetch());

const pull = ()=> {
	git.pull('origin', gitBranch, Object.assign({
		args: '--rebase'
	}, gitOpt), (err) => {
		if (err) throw err;
	});
}
gulp.task('gitPull', ()=>pull());
