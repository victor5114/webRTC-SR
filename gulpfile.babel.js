import _ from 'lodash'
import del from 'del'
import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import lazypipe from 'lazypipe'
import nodemon from 'nodemon'
import runSequence from 'run-sequence'
import { Instrumenter } from 'isparta'

let plugins = gulpLoadPlugins()

const SERVER_PATH = 'app/server'
const SERVER_DIST_PATH = 'app/server-dist'
const CLIENT_PATH = 'app/client'
const CLIENT_DIST_PATH = 'app/client-dist'

const serverPaths = {
    scripts: [
        `${SERVER_PATH}/**/*.js`,
        '!mocha.conf.js',
        '!gulpfile.babel.js',
        '!node_modules/**/*',
        '!dist/**/*.js',
        '!coverage/**/*',
        '!config/local.env.sample.js'
    ],
    json: '**/*.json',
    test: {
        integration: 'api/**/*.integration.js',
        unit: 'api/**/*.spec.js',
        coverage: [
            'api/**/*.js',
            '!api/**/*.events.js',
            '!api/**/*.socket.js'
        ]
    }
}

// const clientPaths = {
//     scripts: [],
//     test: {}
// }

/********************
 * Helper functions
 ********************/

function onServerLog (log) {
    console.log(plugins.util.colors.white('[') +
        plugins.util.colors.yellow('nodemon') +
        plugins.util.colors.white('] ') +
        log.message)
}

/**************************************
 * Reusable pipelines with lazypipe
 **************************************/
let lintServerScripts = lazypipe()
    .pipe(plugins.eslint)
    .pipe(plugins.eslint.format)
    .pipe(plugins.eslint.failAfterError)

let transpileServer = lazypipe()
    .pipe(plugins.sourcemaps.init)
    .pipe(plugins.babel, {
        presets: ['es2015', 'stage-1'],
        plugins: [
            'transform-class-properties',
            'transform-runtime'
        ]
    })
    .pipe(plugins.sourcemaps.write, '.')

let mocha = lazypipe()
    .pipe(plugins.mocha, {
        reporter: 'spec',
        timeout: 5000,
        require: [
            './mocha.conf'
        ]
    })

let istanbul = lazypipe()
    .pipe(plugins.istanbul.writeReports)
    .pipe(plugins.istanbulEnforcer, {
        thresholds: {
            global: {
                lines: 80,
                statements: 80,
                branches: 80,
                functions: 80
            }
        },
        coverageDirectory: './coverage',
        rootDirectory: ''
    })

  /********************
  * Env
  ********************/

gulp.task('env:test', () => {
    plugins.env({
        vars: { NODE_ENV: 'test' }
    })
})

gulp.task('env:prod', () => {
    plugins.env({
        vars: { NODE_ENV: 'production' }
    })
})

gulp.task('lint:scripts:server', () => {
    return gulp.src(_.union(serverPaths.scripts, _.map(serverPaths.test, blob => '!' + blob)))
        .pipe(lintServerScripts())
})

gulp.task('transpile:server', () => {
    return gulp.src(_.union(serverPaths.scripts, serverPaths.json))
        .pipe(transpileServer())
        .pipe(gulp.dest(SERVER_DIST_PATH))
})

gulp.task('start:server', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development'
    nodemon(`-w ${SERVER_PATH} -w ${CLIENT_PATH} ${SERVER_PATH}/index.js`)
        .on('log', onServerLog)
})

gulp.task('start:server:prod', () => {
    const env = process.env.NODE_ENV = process.env.NODE_ENV || 'production'
    console.log(env)
    nodemon(`-w ./${SERVER_DIST_PATH} ./${SERVER_DIST_PATH}`)
        .on('log', onServerLog)
})

gulp.task('clean:dist', () => del([`${SERVER_DIST_PATH}/!(.git*)**`], {dot: true}))

gulp.task('copy:server', () => {
    return gulp.src([
        'package.json',
        '.env.example'
    ], {cwdbase: true})
    .pipe(gulp.dest(SERVER_DIST_PATH))
})

gulp.task('watch', () => {
    var testFiles = _.union(serverPaths.test.unit, serverPaths.test.integration)

    plugins.livereload.listen({ port: 1337 })

    plugins.watch(_.union(serverPaths.scripts, testFiles))
        .pipe(plugins.plumber())
        .pipe(lintServerScripts())
        .pipe(plugins.livereload())
})

gulp.task('build', cb => {
    runSequence(
        'clean:dist',
        'transpile:server',
        'copy:server',
        cb
    )
})

gulp.task('serve', cb => {
    runSequence(
        'lint:scripts:server',
        'start:server',
        'watch',
        cb
    )
})

gulp.task('serve:dist', cb => {
    runSequence(
        'clean:dist',
        'build',
        'start:server:prod',
        cb
    )
})
