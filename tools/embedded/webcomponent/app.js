const { createApp } = Vue;

createApp({
  data() {
    return {
      wrapperAppTitle: 'Embedded App',
      selectedComponent: '',
      webComponentTag: '',
      containerHeight: 800,
      containerWidth: 1024,
      configurations: {
        'lubricator-selection-assistant-local': {
          wrapperAppTitle: 'Lubricator Selection Assistant - Embedded App',
          tag: '<lubricator-selection-assistant language="en" ></lubricator-selection-assistant>',
          src: 'http://localhost:8000/lsa-webcomponent.js',
          height: 950,
          width: 1600,
        },
        'medias-easy-calc': {
          wrapperAppTitle: 'Medias Easy Calc - Embedded App',
          tag: '<engineering-app bearing-designation="6200"></engineering-app>',
          src: 'http://localhost:8000/ea-webcomponent.js',
          height: 1300,
          width: 1400,
        },
        // Add more configurations as needed
      },
    };
  },
  watch: {
    selectedComponent: 'updateConfigurations',
  },
  methods: {
    loadWebComponentScript(src) {
      const oldScript = document.getElementById('webcomponentScript');
      if (oldScript) {
        document.head.removeChild(oldScript);
      }
      const newScript = document.createElement('script');
      newScript.id = 'webcomponentScript';
      newScript.src = src;
      document.head.appendChild(newScript);
    },
    updateConfigurations() {
      const config = this.configurations[this.selectedComponent];
      if (config) {
        this.webComponentTag = config.tag;
        this.containerHeight = config.height;
        this.containerWidth = config.width;
        this.wrapperAppTitle = config.wrapperAppTitle;
        this.loadWebComponentScript(config.src);
      }
    },
  },
  mounted() {
    const configuration = 0;
    this.selectedComponent = Object.keys(this.configurations)[configuration];
    this.updateConfigurations();
  },
}).mount('#app');
