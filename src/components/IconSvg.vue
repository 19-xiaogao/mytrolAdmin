<template>
  <svg aria-hidden="true" class="svg-icon">
    <use :xlink:href="iconName"/>
  </svg>
</template>

<script>
import {computed} from "vue";

export default {
  name: "icon-svg",
  props: {
    icon: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const iconName = computed(() => {
      return `#${props.icon}`;
    });
    return {
      iconName,
    };
  },
};
</script>

<style>
.svg-icon {
  width: 1em;
  height: 1em;
  font-size: inherit;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-icon._height_inherit {
  height: 100%;
}

.svg-icon._width_inherit {
  width: 100%;
}
</style>
