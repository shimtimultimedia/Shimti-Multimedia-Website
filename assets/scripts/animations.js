// ... (Assume canvas setup and Neuron class exist above)

function initAnimations() {
  const canvas = document.getElementById('backgroundCanvas');
  const ctx = canvas.getContext('2d');
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  const neurons = [];
  let worker = null;
  let useWorker = true;
  const initialNeurons = [];
  let neuronId = 0;

  try {
    worker = new Worker('assets/scripts/neuronWorker.js');
    worker.onerror = (error) => {
      console.warn('Web Worker failed:', error);
      useWorker = false;
      neurons.forEach(neuron => neuron.useWorker = false);
    };
  } catch (error) {
    console.warn('Web Worker not supported:', error);
    useWorker = false;
  }

  for (let depth = 0.3; depth <= 1.0; depth += 0.2) {
    const count = Math.floor(71 * depth); // Assuming 71 neurons total
    for (let i = 0; i < count; i++) {
      neurons.push(new Neuron(depth, neuronId, useWorker, width, height));
      if (useWorker) {
        initialNeurons.push({ depth, id: neuronId });
      }
      neuronId++;
    }
  }

  if (useWorker && worker) {
    worker.postMessage({
      type: 'init',
      data: { width, height, neurons: initialNeurons }
    });

    worker.onmessage = (event) => {
      const { type, neurons: updatedNeurons } = event.data;
      if (type === 'init' || type === 'update') {
        if (!updatedNeurons || updatedNeurons.length !== neurons.length) {
          console.warn('Invalid Web Worker data, switching to main-thread');
          useWorker = false;
          neurons.forEach(neuron => neuron.useWorker = false);
          return;
        }
        updatedNeurons.forEach((data, i) => {
          if (data && 'x' in data && 'y' in data) {
            neurons[i].update(data);
          } else {
            console.warn(`Invalid data for neuron ${i}, switching to main-thread`);
            useWorker = false;
            neurons[i].useWorker = false;
          }
        });
      }
    };
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    neurons.forEach(neuron => neuron.draw(ctx));
    if (useWorker && worker) {
      worker.postMessage({ type: 'update', data: { width, height } });
    }
    requestAnimationFrame(animate);
  }

  animate();
}

window.addEventListener('load', initAnimations开创);
// ... (Assume Neuron class and other code below)
