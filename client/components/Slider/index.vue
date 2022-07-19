<template>
  <Swiper
    :slides-per-view="1"
    :space-between="10"
    style="height: 100px"
    @slideChange="onSlideChange"
    @swiper="onSwiper"
  >
    <SwiperSlide style="background-color: red">NestJS</SwiperSlide>
    <SwiperSlide style="background-color: blue">Vue 3</SwiperSlide>
    <SwiperSlide style="background-color: green">Vite 3</SwiperSlide>
  </Swiper>
</template>
<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';

// Import Swiper styles
import 'swiper/css';

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const onSwiper = (swiper) => {
      console.log(swiper);
    };
    const onSlideChange = () => {
      console.log('slide change');
    };
    return {
      onSwiper,
      onSlideChange,
    };
  },
};
</script>
