# Changelog
All notable changes to this project will be documented in this file.

## [Released]

## [3.2.0] - 2023-08-03
- chore: package dependencies, typescript 5
- chore: remove support for NodeJS 14
- chore: major upgrade to glob, fix getMatchingFiles

## [3.1.3] - 2023-01-09
- chore: package dependencies, fs-extra broke its interface wrt to WriteOptions
- ci: workflow action for push to main event

## [3.1.1] - 2022-12-27
- chore: package dependencies

## [3.1.0] - 2022-11-27
- feat: use pnpm as package manager, instead of npm
- fix: unit test for loading bad partial files
- chore: dependencies, typescript, eslint, commitlint and prettier

## [3.0.3] - 2022-11-12
- feat: re-implemented using Typescript
- feat: moved from mocha to jest
- refactor: test data
- BREAKING CHANGE: remove support for JGF V1 Schema

## [2.6.0] - 2022-11-10
- chore: upgrade npm dependencies

## [2.3.1] - 2021-11-26
- chore: Upgraded npm dependencies due security vulnerabilities
- chore: lint:fix script
- chore: tab size change from 4 to 2

## [2.3.0] - 2021-04-11
- Chore: Upgraded npm dependencies due security vulnerability with y18n

## [2.2.2] - 2020-08-13
- Fixed: Security vulnerability with serialize-javascript (used by mocha)
- npm update

## [2.2.1] - 2020-07-24
- Improved documentation

## [2.2.0] - 2020-07-21
- Added eslint jsdoc enforcement
- Fixed all eslint issues
- Added: load FileV1() function for backward compatibility with files generated with v1 schema
- Added: Test application that uses the npm module (also a demo app)

## [2.1.0] - 2020-07-19
- Refactor code in src folder
- Add support for legacy v1 schema, loadFromFileV1
- Fixed: Added missing jgfSchemaV1.json, jgfSchemaV2.json to package

## [2.0.0] - 2020-07-19
- BREAKING CHANGE: Modified to latest JGF 2.0 Schema Spec
- Improved jsdoc
- npm outdated, upgraded/updated modules
- Fixed lint issues

## [1.3.1] - 2020-03-22
- Fixed: README.md, sample code has eslint issues
- Updated npm dependencies: mocha
- Fixed: npm audit issues, minimist

## [1.3.0] - 2020-03-15

### Changed
- Fixed eslint configuration (removed babel-eslint), fixed eslint errors
- Updated npm dependencies: glob, eslint, jsonschema, mocha, fs-extra

## [1.2.2] - 2019-11-03

### Changed
- ESLint Code quality improved

## [1.2.1] - 2019-10-27

### Added
- CODEOWNERS file
- npm test - runs all mocha tests

### Changed
- Updated npm dependencies: glob

## [1.2.0] - 2019-09-14

### Added
- Change log file, CHANGELOG&#46;md

### Changed
- Lean npm deployment, deployment only mandatory source code, excluding unit tests and demos
- Improved documentation of how to perform unit testing 

## [1.1.3] - 2019-07-13

### Changed
- lodash updated to latest version - 4.7.14, removing a security vulnerability
- Improved documentation
