# jay-gee-eff 
JGF - JSON Graph Format npm module

![](https://github.com/bigman73/jay-gee-eff/workflows/nodejs/badge.svg)

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

# Installation
```
npm install jay-gee-eff --save
```

# Usage
## Sample code

```javascript
const { JGFContainer } = require('jay-gee-eff');
const path = require('path');

const program = async () => {
   console.log('Building the NBA JGF Graph...');
    const container = new JGFContainer(true);
    const { graph } = container;
    graph.type = 'sports';
    graph.label = 'NBA Demo Graph';

    const node1Id = 'lebron-james#2544';
    const node1Label = 'LeBron James';
    const metadata1 = {
        type: 'NBA Player'
    };

    const node2Id = 'la-lakers#1610616839';
    const node2Label = 'Los Angeles Lakers';
    const metadata2 = {
        type: 'NBA Team'
    };

    const playerContractLabel = 'Plays for';

    console.log('Adding two nodes...');
    graph.addNode(node1Id, node1Label, metadata1);
    graph.addNode(node2Id, node2Label, metadata2);

    console.log('Adding an edge...');
    graph.addEdge(node1Id, node2Id, playerContractLabel);

    const filename = path.join(path.dirname(__filename), 'nba-graph.json');
    console.log(`Saving to file -> ${filename}`);
    await container.saveToFile(filename, true);

    console.log('Load the saved JGF file');
    const container2 = new JGFContainer();
    await container2.loadFromFile(filename);

    console.log('Graph nodes:');
    for (const node of container2.graph.nodes) {
        console.log(`\t${node.label} {${node.metadata.type}}`);
    }

    console.log('Graph edges:');
    for (const edge of container2.graph.edges) {
        console.log(`\t${edge.source} (->${edge.label}->) ${edge.target}`);
    }

    console.log('-- DONE --');
};

(async () => {
    await program();
})();
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
        "type": "sports",
        "label": "NBA Demo Graph",
        "directed": true,
        "nodes": [{
            "id": "lebron-james#2544",
            "label": "LeBron James",
            "metadata": {
                "type": "NBA Player"
            }
        }, {
            "id": "la-lakers#1610616839",
            "label": "Los Angeles Lakers",
            "metadata": {
                "type": "NBA Team"
            }
        }],
        "edges": [{
                "source": "lebron-james#2544",
                "target": "la-lakers#1610616839",
                "relation": "Plays for"
            }
        ]
    }
}
```

# Unit Testing
Unit tests are performed by the mocha framework.

All unit tests files are defined inside the *test* folder and are prefixed with numbers to ensure correct execution order

## Install mocha globally
Install mocha (once) as a global module
```
npm i mocha -g
```

## From VS.CODE
Run (or bebug) the **Mocha Test - ALL** launch configuration

## From terminal

Execute the command in terminal
```
mocha
```

or simply run 
```
npm test
```

# References
## JGF Specification
http://jsongraphformat.info/

## Test Examples
Source: https://github.com/jsongraph/json-graph-specification/tree/master/examples