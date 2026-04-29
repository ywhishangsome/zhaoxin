import { onMounted, type Ref, ref, onBeforeUnmount, markRaw } from 'vue'
import * as echarts from 'echarts'
export function useChart(chartRef: Ref<HTMLElement | null>, setChartData: any) {
    //参数1：挂载的元素，参数2：

    const chartInstance = ref<echarts.ECharts | null>(null)

    const initChart = async () => {
        if (chartRef.value) {
            chartInstance.value = markRaw(echarts.init(chartRef.value))
            const chartOptions = await setChartData()
            chartInstance.value.setOption(chartOptions)
        }
    }
    const resizeChart = () => {
        chartInstance.value?.resize()
    }

    onMounted(() => {
        initChart()
        window.addEventListener('resize', resizeChart)
    })
    onBeforeUnmount(() => {
        window.removeEventListener('resize', resizeChart)
        if (chartInstance.value) {
            chartInstance.value.dispose()
        }
    })
}