<template>
  <div id="app" class="dark">
    <header>
      <h1>TriDesignWorks</h1>
    </header>
    <main>
      <ImageUploader @image-uploaded="handleImageUpload" />
      <div v-if="image">
        <div class="sliders">
          <label>
            Grid Size:
            <input type="number" v-model.number="gridSize" min="5" max="100" />
            <input type="range" v-model.number="gridSize" min="5" max="100" />
            {{ gridSize }}
          </label>
          <label>
            Jitter:
            <input type="number" v-model.number="jitter" min="0" max="50" />
            <input type="range" v-model.number="jitter" min="0" max="50" />
            {{ jitter }}
          </label>
          <label>
            Blend:
            <input type="number" v-model.number="blend" min="0" max="100" />
            <input type="range" v-model.number="blend" min="0" max="100" />
            {{ blend }}
          </label>
        </div>
        <button @click="triangulate">Triangulate</button>
      </div>
      <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    </main>
  </div>
</template>

<script>
import ImageUploader from './components/ImageUploader.vue';
import { triangulateImage } from './utils/triangulation';

export default {
  name: 'App',
  components: {
    ImageUploader,
  },
  data() {
    return {
      image: null,
      gridSize: 20,
      jitter: 5,
      blend: 100,
      canvasWidth: 800,
      canvasHeight: 600,
    };
  },
  methods: {
    handleImageUpload(image) {
      this.image = image;
      const img = new Image();
      img.src = image;
      img.onload = () => {
        this.canvasWidth = img.width;
        this.canvasHeight = img.height;
        this.$refs.canvas.width = this.canvasWidth;
        this.$refs.canvas.height = this.canvasHeight;
        this.loadExampleImage();
      };
    },
    loadExampleImage() {
      const ctx = this.$refs.canvas.getContext('2d');
      const img = new Image();
      img.src = this.image;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight);
      };
    },
    triangulate() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      triangulateImage(ctx, this.image, this.gridSize, this.jitter, this.blend);
    },
  },
  watch: {
    gridSize() {
      this.triangulate();
    },
    jitter() {
      this.triangulate();
    },
    blend() {
      this.triangulate();
    },
  },
};
</script>

<style scoped>
#app {
  text-align: center;
  background-color: #2c3e50;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 1rem;
}
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.sliders {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
canvas {
  border: 1px solid #ccc;
  margin-top: 1rem;
}
</style>
