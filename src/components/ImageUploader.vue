<template>
    <div>
      <input type="file" @change="onFileChange" accept="image/*" />
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      onFileChange(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = e => {
            this.$emit('image-uploaded', e.target.result);
          };
          reader.readAsDataURL(file);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  input[type="file"] {
    margin: 1rem 0;
  }
  </style>
  