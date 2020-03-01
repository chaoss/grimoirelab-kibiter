# Kibiter 6.1.4

Kibiter is a custom soft fork of [Kibana](https://github.com/elastic/kibana) which empowers [GrimoireLab](https://chaoss.github.io/grimoirelab/) Panels with metrics & data visualizations.

- [Installation](#installation)
- [Features](#features)
- [Compatibility with Elasticsearch](#compatibility-with-elasticsearch)
- [Contributing](#contributing)
- [License](#license)

## Installation

There are several ways for installing Kibiter on your system: from releases, Docker images or source code.

### Releases

- Go to [release tab](https://github.com/chaoss/grimoirelab-kibiter/releases) and download the version you want.

### Docker images

There are four Docker images of Kibiter, they have the following tags:

- `bitergia/kibiter:community-v6.1.4-X` (being X the version of the release), the image that corresponds to the community version of Kibiter.
- `bitergia/kibiter:optimized-v6.1.4-X` (being X the version of the release), the image that corresponds to the optimized version of Kibiter.
- `bitergia/kibiter:secured-v6.1.4-X` (being X the version of the release), the image that corresponds to the secured (with Search Guard) version of Kibiter.
- `bitergia/kibiter:default-v6.1.4-X` (being X the version of the release), the image that corresponds to the non-optimized version of Kibiter.


### Source code

Clone the repository from the branch `integration-6.1.4-<version>`, where version can be //optimized//, //secured// or //community//.
```
git clone https://github.com/chaoss/grimoirelab-kibiter -b integration-6.1.4-<version>
```

Install the npm dependencies

```
cd grimoirelab-kibiter
npm install
```

Launch Kibiter
```
./bin/kibana
```

## Features

Kibiter provides several features, not present in Kibana, that have been developed for GrimoireLab. The most important ones are described below.

### Panel menu

If you are using Kibiter with the [GrimoireLab](https://chaoss.github.io/grimoirelab/) tools, you will see a quick menu at the top of the page, like the one below:

<img alt="Panel menu" src="https://i.imgur.com/6hO4aEV.png">


This menu allows you to navigate through the GrimoireLab panels, see its structure below:

<img alt="Panel menu opened" src="https://i.imgur.com/9yimD9m.png">

### New visualization plugins

Kibiter has several plugins installed by default, they improve the user customization and add more information to the dashboards. Clearly, they are all open source. The plugins are listed below:

- [Network plugin](https://github.com/dlumbrer/kbn_network) supports data visualization in a graph-style way.
- [Searchtables plugin](https://github.com/dlumbrer/kbn_searchtables) improves Kibiter tables by adding a search box to perform searches without applying filters.
- [Radar plugin](https://github.com/dlumbrer/kbn_radar) allows to explore the data using radar visualizations.
- [Dot plot plugin](https://github.com/dlumbrer/kbn_dotplot) empowers Kibiter with dot-plot visualizations, granting  to add metrics in both X and Y axis.
- [Polar plugin](https://github.com/dlumbrer/kbn_polar) enhances Kibiter with polar visualizations for your data.

## Version compatibility with Elasticsearch

Following the Kibana docs, you should be running Elasticsearch and Kibiter with matching version numbers. However, Kibiter will run (and log a warning) in case your Elasticsearch has a newer minor or patch number. 
Note that Kibiter won't be able to run, if your Elasticsearch has an older version number or a newer _major_ number. 

The table below shows some examples to illustrate the relationships between different types of version numbers.

| Situation                 | Example Kibiter version     | Example ES version | Outcome |
| ------------------------- | -------------------------- |------------------- | ------- |
| Versions are the same.    | 5.1.2                      | 5.1.2              | 💚 OK      |
| ES patch number is newer. | 5.1.__2__                  | 5.1.__5__          | ⚠️ Logged warning      |
| ES minor number is newer. | 5.__1__.2                  | 5.__5__.0          | ⚠️ Logged warning      |
| ES major number is newer. | __5__.1.2                  | __6__.0.0          | 🚫 Fatal error      |
| ES patch number is older. | 5.1.__2__                  | 5.1.__0__          | ⚠️ Logged warning      |
| ES minor number is older. | 5.__1__.2                  | 5.__0__.0          | 🚫 Fatal error      |
| ES major number is older. | __5__.1.2                  | __4__.0.0          | 🚫 Fatal error      |

## Contributing

We happily accept contributions, and we will help you in case you need. We follow the same contribution process that Kibana provides, thus have a look at:

- [CONTRIBUTING.md](CONTRIBUTING.md) if you want to get Kibiter up and running.
- [STYLEGUIDE.md](STYLEGUIDE.md) if you plan to submit a pull request.
- [GitHub issue tracker](https://github.com/chaoss/grimoirelab-kibiter/issues) for all other questions, we will answer you as soon as possible.

If you find a bug or want to request a new feature, please open a issue on [GitHub](https://github.com/chaoss/grimoirelab-kibiter/issues). To avoid duplicated issues, check the existing issues to make sure someone else hasn't already created a similar one.
