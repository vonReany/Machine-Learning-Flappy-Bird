/***********************************************************************************
/* Genetic Algorithm implementation
/***********************************************************************************/

var GeneticAlgorithm = function(max_units, top_units) {
    this.max_units = max_units;
    this.top_units = top_units;
    if (this.max_units < this.top_units) this.top_units = this.max_units;

    this.Population = [];
    this.SCALE_FACTOR = 200; // Scale factor of Neural Network inputs
}

GeneticAlgorithm.prototype = {
    reset: function() {
        this.iteration = 1;
        this.mutateRate = 0.2;

        this.best_population = 0;
        this.best_fitness = 0;
        this.best_score = 0;
        this.cur_score = 0;
        this.count = 0; // how many bird created so far
    },

    createPopulation: function() {
        this.Population = [];
        for (var i = 0; i < this.max_units; i++) {
            this.Population.push(this.createNewUnit());
        }
    },

    createNewUnit: function() {
        var newUnit = new synaptic.Architect.Perceptron(2, 6, 1);
        newUnit.index = i;
        newUnit.fitness = 0;
        newUnit.score = 0;
        newUnit.isWinner = false; // shows if it is survived from last generation
        newUnit.birdId = this.count++;
        return newUnit;
    },

    activateBrain: function(bird, target) {
        var targetDeltaX = this.normalize(target.x, 700) * this.SCALE_FACTOR; // horizontal distance
        var targetDeltaY = this.normalize(bird.y - target.y, 800) * this.SCALE_FACTOR; // vertical distance
        var inputs = [targetDeltaX, targetDeltaY];

        var outputs = this.Population[bird.index].activate(inputs); // running neural network
        if (outputs[0] > 0.5) bird.flap();
        this.cur_score = bird.score_curr;
    },

    evolvePopulation: function() {
        var Winners = this.selection();

        if (Winners[0].score < 4) {
            this.createPopulation();
        }

        for (var i = this.top_units; i < this.max_units; i++) {
            var parentA, parentB, offspring;

            if (i == this.top_units) {
                parentA = Winners[0].toJSON();
                parentB = Winners[1].toJSON();
                offspring = this.crossOver(parentA, parentB);
            } else if (i >= this.max_units - 2) {
                offspring = this.createNewUnit();
            } else {
                parentA = this.getRandomUnit(Winners).toJSON();
                parentB = this.getRandomUnit(Winners).toJSON();
                offspring = this.crossOver(parentA, parentB);
            }

            offspring = this.mutation(offspring);

            var newUnit = synaptic.Network.fromJSON(offspring);
            newUnit.index = this.Population[i].index;
            newUnit.fitness = 0;
            newUnit.score = 0;
            newUnit.isWinner = false;
            newUnit.birdId = this.count++; // created by evolving

            this.Population[i] = newUnit;
        }

        if (Winners[0].fitness > this.best_fitness) {
            this.best_population = this.iteration;
            this.best_fitness = Winners[0].fitness;
            this.best_score = Winners[0].score;
            if (this.best_score > 200) {
                this.saveToFile(Winners[0].toJSON());
            }
        }

        this.Population.sort(function(unitA, unitB) {
            return unitA.index - unitB.index;
        });
    },

    selection: function() {
        var sortedPopulation = this.Population.sort(
            function(unitA, unitB) {
                return unitB.fitness - unitA.fitness;
            }
        );

        for (var i = 0; i < this.top_units; i++) this.Population[i].isWinner = true; // survival of the fittest
        return sortedPopulation.slice(0, this.top_units);
    },

    crossOver: function(parentA, parentB) {
        var cutPointBias = this.random(0, parentA.neurons.length - 1);
        var cutPointConn = this.random(0, parentA.connections.length - 1);

        // Crossover rules:
        // 1. left side to the crossover point is copied from one parent
        // 2. right side after the crossover point is copied from the second parent

        // swap 'bias' information between both parents:
        for (var i = cutPointBias; i < parentA.neurons.length; i++) {
            var biasFromParentA = parentA.neurons[i]['bias'];
            parentA.neurons[i]['bias'] = parentB.neurons[i]['bias'];
            parentB.neurons[i]['bias'] = biasFromParentA;
        }

        // swap 'weight' information between both parents:
        for (var i = cutPointConn; i < parentA.connections.length; i++) {
            var biasFromParentA = parentA.connections[i]['weight'];
            parentA.connections[i]['weight'] = parentB.connections[i]['weight'];
            parentB.connections[i]['weight'] = biasFromParentA;
        }

        return this.random(0, 1) == 1 ? parentA : parentB;
    },

    mutation: function(offspring) {
        // mutate some 'bias' information of the offspring neurons
        for (var i = 0; i < offspring.neurons.length; i++) {
            offspring.neurons[i]['bias'] = this.mutate(offspring.neurons[i]['bias'], 1);
        }

        // mutate some 'weight' information of the offspring connections
        for (var i = 0; i < offspring.connections.length; i++) {
            offspring.connections[i]['weight'] = this.mutate(offspring.connections[i]['weight'], 2);
        }

        return offspring;
    },

    mutate: function(gene, multiplier) {
        if (Math.random() < this.mutateRate * multiplier) {
            var mutateFactor = 1 + ((Math.random() - 0.5) * 2 + (Math.random() - 0.5) + (Math.random() - 0.5));
            gene *= mutateFactor;
        }
        return gene;
    },

    random: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    getRandomUnit: function(array) {
        return array[this.random(0, array.length - 1)];
    },

    normalize: function(value, lim) {
        value = Math.min(lim, value);
        value = Math.max(-lim, value);
        return (value / lim);
    },

    saveToFile: function(content) {
        this.download(JSON.stringify(content), 'bird.json.txt', 'application/json');
    },

    download: function(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
        console.log("DOWNLOADED");
        console.log(c = content);
    }
};