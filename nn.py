import numpy as np

class layer:
    def __init__(self, n_inputs, n_neurons, output_layer = False):
        self.n_neurons = n_neurons
        self.n_inputs = n_inputs
        self.output_layer = output_layer
        self.weights = np.random.rand(n_neurons, n_inputs)
        self.biases = np.random.rand(n_neurons)

    def forward(self, inputs):
        self.inputs = inputs
        z = np.dot(self.weights, self.inputs) + self.biases
        if not self.output_layer:
            z[z < 0] = 0 ### hardcoded ReLU activiation function
        self.outputs = z

    def dump(self):
        return (self.weights, self.biases, self.output_layer)

    def load(self, weights, biases, output_layer = False):
        self.weights = weights
        self.biases = biases
        self.output_layer = output_layer
        self.n_neurons, self.n_inputs = np.shape(self.weights)

    def debug(self):
        print("="*10)
        print(self.n_neurons, self.n_inputs)
        print("Output layer:", self.output_layer)
        print("="*10)
        print(self.weights)
        print("="*10)
        print(self.biases)
        print("="*10)

class network:
    def __init__(self, l_widths, learning_rate = .01):
        self.n_hidden = len(l_widths) - 2
        self.n_inputs = l_widths[0]
        self.n_outputs = l_widths[-1]
        self.learning_rate = learning_rate
        is_output = ([False] * self.n_hidden) + [True]
        self.layers = []
        for (n_in, n_n, is_o) in zip(l_widths[:-1], l_widths[1:], is_output):
            self.layers.append(layer(n_in, n_n, is_o))

    def forward(self, inputs):
        self.inputs = inputs
        aux = inputs
        for l in self.layers:
            l.forward(aux)
            aux = l.outputs
        self.outputs = aux

    # X = inputs, y = real/correct output, o = observed/predicted output
    def backward(self, X, y, o):
        # compute mean squared error
        self.cost = np.dot(y - o, y - o) / self.n_outputs
        # compute derivative of cost w.r.t outputs
        self.layers[-1].delta = 2 * (y - o) / self.n_outputs
        for i in range(self.n_hidden, 0, -1):
            next_layer = self.layers[i+1]
            aux = np.dot(next_layer.weights.T, next_layer.delta)
            aux = 1. * (aux > 0) ## ReLU derivative
            self.layers[i].delta = aux
        for l in self.layers:
            grad = np.dot(l.delta, l.inputs.T)
            l.weights += self.learning_rate * grad

    def train(self, X, y):
        self.forward(X)
        self.backward(X, y, self.outputs)

    def load(self, data):
        self.learning_rate, layers = data
        self.layers = []
        for (weights, biases, output_layer) in layers:
            self.layers.append(weights, biases, output_layer)
        self.n_hidden = len(self.layers) - 1
        self.n_inputs = self.layers[0].n_inputs
        self.n_outputs = self.layers[-1].n_outputs

    def dump(self):
        return (self.learning_rate, [l.dump() for l in self.layers])

    def debug(self):
        print("learning_rate: " + self.learning_rate)
        for (i,l) in zip(range(self.n_hidden+1), self.layers):
            print("="*5 + " layer " + str(i) + " " + "="*5)
            l.debug()



