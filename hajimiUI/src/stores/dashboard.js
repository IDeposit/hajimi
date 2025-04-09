import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useDashboardStore = defineStore('dashboard', () => {
  // 状态
  const status = ref({
    keyCount: 0,
    modelCount: 0,
    retryCount: 0,
    last24hCalls: 0,
    hourlyCalls: 0,
    minuteCalls: 0
  })

  const config = ref({
    maxRequestsPerMinute: 0,
    maxRequestsPerDayPerIp: 0,
    currentTime: '',
    fakeStreaming: false,
    fakeStreamingInterval: 0,
    randomString: false,
    localVersion: '',
    remoteVersion: '',
    hasUpdate: false
  })

  const apiKeyStats = ref([])
  const logs = ref([])
  const isRefreshing = ref(false)
  
  // 添加模型相关状态
  const selectedModel = ref('all')
  const availableModels = ref([])
  
  // 夜间模式状态
  const isDarkMode = ref(localStorage.getItem('darkMode') === 'true')
  
  // 监听夜间模式变化，保存到localStorage
  watch(isDarkMode, (newValue) => {
    localStorage.setItem('darkMode', newValue)
    applyDarkMode(newValue)
  })
  
  // 应用夜间模式
  function applyDarkMode(isDark) {
    if (isDark) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  }
  
  // 初始应用夜间模式
  applyDarkMode(isDarkMode.value)

  // 获取仪表盘数据
  async function fetchDashboardData() {
    if (isRefreshing.value) return // 防止重复请求
    
    isRefreshing.value = true
    try {
      const response = await fetch('/api/dashboard-data')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      updateDashboardData(data)
    } catch (error) {
      console.error('获取数据失败:', error)
    } finally {
      isRefreshing.value = false
    }
  }

  // 更新仪表盘数据
  function updateDashboardData(data) {
    // 更新状态数据
    status.value = {
      keyCount: data.key_count || 0,
      modelCount: data.model_count || 0,
      retryCount: data.retry_count || 0,
      last24hCalls: data.last_24h_calls || 0,
      hourlyCalls: data.hourly_calls || 0,
      minuteCalls: data.minute_calls || 0
    }

    // 更新配置数据
    config.value = {
      maxRequestsPerMinute: data.max_requests_per_minute || 0,
      maxRequestsPerDayPerIp: data.max_requests_per_day_per_ip || 0,
      currentTime: data.current_time || '',
      fakeStreaming: data.fake_streaming || false,
      fakeStreamingInterval: data.fake_streaming_interval || 0,
      randomString: data.random_string || false,
      localVersion: data.local_version || '',
      remoteVersion: data.remote_version || '',
      hasUpdate: data.has_update || false
    }

    // 更新API密钥统计
    if (data.api_key_stats) {
      apiKeyStats.value = data.api_key_stats
      
      // 提取所有可用的模型
      const models = new Set(['all']) // 始终包含"全部"选项
      data.api_key_stats.forEach(stat => {
        if (stat.model_stats) {
          Object.keys(stat.model_stats).forEach(model => {
            models.add(model)
          })
        }
      })
      availableModels.value = Array.from(models)
      
      // 如果当前选择的模型不在可用模型列表中，重置为"all"
      if (!availableModels.value.includes(selectedModel.value)) {
        selectedModel.value = 'all'
      }
    }

    // 更新日志
    if (data.logs) {
      logs.value = data.logs
    }
  }
  
  // 设置选择的模型
  function setSelectedModel(model) {
    selectedModel.value = model
  }

  // 切换夜间模式
  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
  }

  return {
    status,
    config,
    apiKeyStats,
    logs,
    isRefreshing,
    fetchDashboardData,
    selectedModel,
    availableModels,
    setSelectedModel,
    isDarkMode,
    toggleDarkMode
  }
})