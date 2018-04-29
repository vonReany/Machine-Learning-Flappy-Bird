# Neural Networks and Genetic Algorithm combination to play Flappy Bird

In this project we aimed to achieve an **Artificial Intelligence (AI)** which can play **Flappy Bird** without being **explicitly programmed**. Normally, a machine learns by looking for patterns among massive data loads. Unlike humans, machines can not generalize knowledge or can not transfer their learning from one application to another.

**Artificial Neural Networks (ANN)** are inspired by the structure and functions of biological neural networks. These networks are made out of many neurons which send signals to each other. To create an artificial brain, ANN simulates neurons and synapses to form a neural network just like in the brain. But, yet, **ANNs does not transfer their learning with each other like humans learn.**

Combination of Neural Networks and Genetic Algorithms tries to solve this lack of learning transfer. Every generation is mix of best units in the previous generation.

> "In the long history of humankind (and animal kind, too) those who learned to collaborate and improvise most effectively have prevailed."
> --- **Charles Darwin**

## Differences
[Main repository can be found here.](https://github.com/ssusnic/Machine-Learning-Flappy-Bird) Differences will be discussed below:

### Game
Game was developed to 1280x720 resolution. It is adapted to 1920x1080 by editing the code and assets. Also, our system allows it can be changed 1280x720 back with just changing one line of code.

### Neural Network Architecture
It is same with main repository.
To play the game, each unit (bird) has its own neural network consisted of the next 3 layers:

1. an input layer with 2 neurons presenting what a bird sees:
-- horizontal distance between the bird and the closest gap
-- height difference between the bird and the closest gap
2. a hidden layer with 6 neurons
3. an output layer with 1 neuron used to provide an action as follows:
 if output > 0.5 then flap else do nothing

![Flappy Bird Neural Network](https://raw.githubusercontent.com/ssusnic/Machine-Learning-Flappy-Bird/master/screenshots/flappy_06.png  "Flappy Bird Neural Network")
  
There is used [Synaptic Neural Network library](https://synaptic.juancazala.com) to implement entire artificial neural network instead of making a new one from the scratch.

### Neuro Evolution Process
The main approach of Machine Learning (ML) algorithm is based on the Neuro Evolution. This form of machine learning used Genetic Algorithm (GA) to train Artifical Neural Networks (ANN). Steps are basically same with a few differences from main repository. Steps:

1. Created an initial population of 20 units (birds) with random **ANNs**
2. Let all units play the game simultaneously by using their own ANNs
3. For each unit calculate its **fitness** score to measure its quaility
fitness = total travelled distance - distance to the closest gap
![Flappy Bird Fitness](https://raw.githubusercontent.com/ssusnic/Machine-Learning-Flappy-Bird/master/screenshots/flappy_08.png  "Flappy Bird Fitness")
 
4. When all units are died, evolution start with current population:
4.1. Sort the birds of the current population by their fitness scores
4.2. Selecting the top 6 units (winners) and pass them directly on to the next population which is called Elitism method
4.3. Next population consist 20 birds like previous populations:
  --- 6 winner bird
  --- 1 offspring as a crossover product of the two best winner birds (very best and second very best)
  --- 10 offsprings as a crossover products of two random selected winner birds
  --- 3 totally new birds with random ANNs
4.4. Apply random mutations on each offspring to add some variations with a %5 chance on bias values of ANN and %10 chance on weight values of ANN
6. Go back to the step 2

### Implementation and Requirements
Implementation, requirements and explanation of script files can be found in main repository.