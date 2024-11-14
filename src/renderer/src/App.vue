<script setup lang="ts">
// import Versions from './components/Versions.vue'
//
// const ipcHandle = () => window.electron.ipcRenderer.send('ping')
//
// window.electron.ipcRenderer.on('reply1', (event, data) => {
//   console.log('接收到了消息: ', data)
// })

import echarts from 'echarts/lib/echarts'
import { onMounted, ref } from 'vue'
// import chinaJson from '../../json/map_data.json'
import china from 'echarts/map/json/china.json'


import getMapData from '../../api/getMapData'

const chartsDom = ref()
console.log(8888888)
onMounted(() => {
    console.log(2222)
    let myCharts = echarts.init(chartsDom.value)
    echarts.registerMap('china', china)
    // getMapData.then(res => {
    //     console.log(res)
    //     myCharts.hideLoading();
    //     echarts.registerMap('CN', res.data);
    //     // let option = {
    //     //     series: [{
    //     //
    //     //     }]
    //     // }
    // })
})

</script>

<template>
    <div style="width: 800px; height: 600px" ref="chartsDom"></div>
    <!--  <img alt="logo" class="logo" src="./assets/electron.svg" />-->
    <!--  <div class="creator">Powered by electron-vite</div>-->
    <!--  <div class="text">-->
    <!--    Build an Electron app with-->
    <!--    <span class="vue">Vue</span>-->
    <!--    and-->
    <!--    <span class="ts">TypeScript</span>-->
    <!--  </div>-->
    <!--  <p class="tip">Please try pressing <code>F12</code> to open the devTool</p>-->
    <!--  <div class="actions">-->
    <!--    <div class="action">-->
    <!--      <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">Documentation</a>-->
    <!--    </div>-->
    <!--    <div class="action">-->
    <!--      <a target="_blank" rel="noreferrer" @click="ipcHandle">Send IPC</a>-->
    <!--    </div>-->
    <!--  </div>-->
    <!--  <Versions />-->
</template>
