oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Setup
```
$ npm i
$ npm run build
```
<br>

# Usage
<!-- usage -->
```sh-session
$ npm install -g mydatabase
$ mydatabase COMMAND
running command...
$ mydatabase (--version)
mydatabase/0.0.0 linux-x64 node-v18.16.1
$ mydatabase --help [COMMAND]
USAGE
  $ mydatabase COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`mydatabase hello PERSON`](#mydatabase-hello-person)
* [`mydatabase hello world`](#mydatabase-hello-world)
* [`mydatabase help [COMMANDS]`](#mydatabase-help-commands)
* [`mydatabase plugins`](#mydatabase-plugins)
* [`mydatabase plugins:install PLUGIN...`](#mydatabase-pluginsinstall-plugin)
* [`mydatabase plugins:inspect PLUGIN...`](#mydatabase-pluginsinspect-plugin)
* [`mydatabase plugins:install PLUGIN...`](#mydatabase-pluginsinstall-plugin-1)
* [`mydatabase plugins:link PLUGIN`](#mydatabase-pluginslink-plugin)
* [`mydatabase plugins:uninstall PLUGIN...`](#mydatabase-pluginsuninstall-plugin)
* [`mydatabase plugins:uninstall PLUGIN...`](#mydatabase-pluginsuninstall-plugin-1)
* [`mydatabase plugins:uninstall PLUGIN...`](#mydatabase-pluginsuninstall-plugin-2)
* [`mydatabase plugins update`](#mydatabase-plugins-update)

## `mydatabase hello PERSON`

Say hello

```
USAGE
  $ mydatabase hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/oclif/mydatabase/blob/v0.0.0/dist/commands/hello/index.ts)_

## `mydatabase hello world`

Say hello world

```
USAGE
  $ mydatabase hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ mydatabase hello world
  hello world! (./src/commands/hello/world.ts)
```

## `mydatabase help [COMMANDS]`

Display help for mydatabase.

```
USAGE
  $ mydatabase help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for mydatabase.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.11/src/commands/help.ts)_

## `mydatabase plugins`

List installed plugins.

```
USAGE
  $ mydatabase plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ mydatabase plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.4.7/src/commands/plugins/index.ts)_

## `mydatabase plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ mydatabase plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ mydatabase plugins add

EXAMPLES
  $ mydatabase plugins:install myplugin 

  $ mydatabase plugins:install https://github.com/someuser/someplugin

  $ mydatabase plugins:install someuser/someplugin
```

## `mydatabase plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ mydatabase plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ mydatabase plugins:inspect myplugin
```

## `mydatabase plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ mydatabase plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ mydatabase plugins add

EXAMPLES
  $ mydatabase plugins:install myplugin 

  $ mydatabase plugins:install https://github.com/someuser/someplugin

  $ mydatabase plugins:install someuser/someplugin
```

## `mydatabase plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ mydatabase plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ mydatabase plugins:link myplugin
```

## `mydatabase plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ mydatabase plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ mydatabase plugins unlink
  $ mydatabase plugins remove
```

## `mydatabase plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ mydatabase plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ mydatabase plugins unlink
  $ mydatabase plugins remove
```

## `mydatabase plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ mydatabase plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ mydatabase plugins unlink
  $ mydatabase plugins remove
```

## `mydatabase plugins update`

Update installed plugins.

```
USAGE
  $ mydatabase plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
