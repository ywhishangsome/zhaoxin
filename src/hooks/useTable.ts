import { ref, reactive, onMounted, toRaw } from 'vue'
import { ElMessage } from 'element-plus'
export function useTable<T>(api: any, searchParams: any) {
    const tableData = ref<T[]>([])
    const loading = ref<boolean>(false)
    // 分页相关
    const totals = ref<number>(0)
    const pageInfo = reactive({
        page: 1,
        limit: 10,
    })
    const loadData = async () => {
        loading.value = true
        try {
            const { data } = await api(pageInfo.page, pageInfo.limit, toRaw(searchParams))
            const { records, total, current, size, pages } = data
            console.log(records);

            tableData.value = records
            totals.value = total
            // console.log("tableData:", tableData.value);
            loading.value = false
        } catch (err) {
            console.log(err)
            ElMessage.error('获取数据失败')
        }
    }
    onMounted(() => {
        loadData()
    })

    const handleSizeChange = (e: any) => {
        // console.log("handleSizeChange", e);
        pageInfo.limit = e
        loadData()

    }
    const handleCurrentChange = (e: any) => {
        // console.log("handleCurrentChange", e);
        pageInfo.page = e
        loadData()

    }


    const handleSearch = () => {
        loadData()
    }
    const resetPage = () => {
        pageInfo.page = 1
        pageInfo.limit = 10
        loadData()
    }
    return { totals, resetPage, handleSearch, handleCurrentChange, handleSizeChange, loadData, loading, pageInfo, tableData }
}

