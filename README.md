# jay-gee-eff

JGF - JSON Graph Format manipulation module for JavaScript. Reads and writes JGF files.

![](https://github.com/bigman73/jay-gee-eff/workflows/nodejs-ci/badge.svg)

A library that provides the following features:

1. Create JGF in-memory graphs
   1. Add nodes
   2. Add edges
   3. List nodes
   4. List edges
   5. Remove nodes
   6. Remove edges
   7. Lookup nodes by id
   8. Lookup edges by source and target nodes, with optional edge relation
   9. Update node properties and meta data
2. Save in-memory graphs into a 100% compatible JGF JSON file
3. Load a JGF JSON file into memory
4. Validate JGF JSON files, for syntax (JGF schema) and semantics (invalid nodes and edges)
5. Ability to load and merge partial JGF graph files (a single graph spread over multiple 'partial' graph files)
6. Support the JGF v2 Schema

## Important note

The JGF Schema has breaking changes from v1 to v2, in other words v2 is not backward compatible with v1. jay-gee-eff supported JGF Schema v1 up to version 1.3.1. 
Starting from jay-gee-eff version 3.0.0 the support for schema V1 has been dropped.

# Installation

## Install the package
```bash
npm install jay-gee-eff
```

# Usage

## Sample code

```javascript
/* eslint-disable no-console */
import path from 'path'

import { JGFContainer } from 'jay-gee-eff'

/**
 * Main program - demonstrates building an NBA JGF graph.
 */
const program = async () => {
  console.log('Building the NBA JGF Graph...')
  const container = new JGFContainer(true)
  const { graph } = container
  graph.id = 'nba-demo-graph-2020'
  graph.type = 'sports'
  graph.label = 'NBA Demo Graph'
  graph.metadata = {
    season: 2020
  }

  const node1Id = 'lebron-james#2544'
  const node1Label = 'LeBron James'
  const metadata1 = {
    type: 'NBA Player'
  }

  const node2Id = 'la-lakers#1610616839'
  const node2Label = 'Los Angeles Lakers'
  const metadata2 = {
    type: 'NBA Team'
  }

  const playerContractRelation = 'plays-for'
  const playerContractLabel = 'Plays for'

  console.log('Adding two nodes...')
  graph.addNode(node1Id, node1Label, metadata1)
  graph.addNode(node2Id, node2Label, metadata2)

  console.log('Adding an edge...')
  graph.addEdge(node1Id, node2Id, playerContractRelation, playerContractLabel)

  const filename = path.join(path.dirname(__filename), 'nba-graph.json')
  console.log(`Saving to file -> ${filename}`)
  await container.saveToFile(filename, true)

  console.log('Load the saved JGF file')
  const container2 = new JGFContainer()
  await container2.loadFromFile(filename)

  console.log('Graph nodes:')
  for (const node of Object.values(container2.graph.nodes)) {
    console.log(`\t${node.label} {${node.metadata?.type}}`)
  }

  console.log('Graph edges:')
  for (const edge of container2.graph.edges) {
    console.log(`\t${edge.source} (->${edge.label}->) ${edge.target}`)
  }

  console.log('-- DONE --')
}

;(async () => {
  await program()
})()

```

### Expected console output

```
Building the NBA JGF Graph...
Adding two nodes...
Adding an edge...
Saving to file -> /test-jay-gee-eff/demo/nba-graph.json
Load the saved JGF file
loadFromFile, isSingleGraph: true
Graph nodes:
	LeBron James {NBA Player}
	Los Angeles Lakers {NBA Team}
Graph edges:
	lebron-james#2544 (->Plays for->) la-lakers#1610616839
-- DONE --
```

### The JGF output file (nba-graph.json)

```json
{
    "graph": {
        "id": "nba-demo-graph-2020",
        "type": "sports",
        "label": "NBA Demo Graph",
        "directed": true,
        "metadata": {
            "season": 2020
        },
        "nodes": {
            "lebron-james#2544": {
                "label": "LeBron James",
                "metadata": {
                    "type": "NBA Player"
                }
            },
            "la-lakers#1610616839": {
                "label": "Los Angeles Lakers",
                "metadata": {
                    "type": "NBA Team"
                }
            }
        },
        "edges": [
            {
                "source": "lebron-james#2544",
                "target": "la-lakers#1610616839",
                "relation": "plays-for",
                "label": "Plays for"
            }
        ]
    }
}
```

# Development
> `jay-gee-eff` uses `pnpm` instead of `npm` package manager

## Install pnpm globally
Follow the instructions specific for your operating system
https://pnpm.io/installation

The recommended and easy way -> use `npm`:
```bash
npm install -g pnpm
```

Ensure that after the installation the command runs successfully:
```bash
pnpm --version
```

> If not there may be a problem with the PATH environment variable

## Install dependencies
Install all projects dependencies with `pnpm`:
```bash
pnpm install
```

## Unit Testing

Unit tests are performed by the `jest` framework.

All unit tests files are defined inside the `tests` folder and are prefixed with numbers to ensure correct execution order


### From VS.CODE
Use the Jest Runner extension to run or debug a test or test suite.


### From terminal

Execute the command in terminal

```bash
pnpm test
```

## Run the demo program locally

Execute the command in terminal to generate an NBA JGF file

```bash
pnpm demo
```

## Prettier
### Check code style formatting
```bash
pnpm prettier
```

### Fix code style formatting
```bash
pnpm prettier:fix
```


## Lint
```bash
pnpm lint
```

## Publishing a version to npm registry

```bash
# Increment version
npm version <patch | minor | major>

# Push tags to github
git push --tags

# Publish package to npm
pnpm publish
```

# References

## JGF Specification

http://jsongraphformat.info/

## Test Examples

Source: https://github.com/jsongraph/json-graph-specification/tree/master/examples

