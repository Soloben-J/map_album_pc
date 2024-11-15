<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const chartsDom = ref()

const getMapData = async () => {
    console.log(2222)

    const res = await fetch('/china-new.json')
    const chinaGeoJson = await res.json()
    console.log(chinaGeoJson)
    echarts.registerMap('china', chinaGeoJson)
    const myCharts = echarts.init(chartsDom.value)
    myCharts.setOption({
        title: {
            text: '我拍的地图相册'
        },
        // tooltip: {
        //     trigger: 'item'
        // },
        // visualMap: {
        //     type: 'piecewise',
        //     max: 10000,
        //     min: 0,
        //     text: ['高', '低'],
        //     calculable: true
        // },
        series: [
            {
                name: '地图相册',
                type: 'map',
                map: 'china'
                // data
            }
        ]
    })

    myCharts.on('click', (data) => {
        console.log(data)
    })
}
onMounted(() => {
    getMapData()
})
</script>

<template>
    <div ref="chartsDom" style="width: 800px; height: 600px"></div>
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
