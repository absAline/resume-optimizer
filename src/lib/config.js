export const TABS = [
  { id: 'analyze', label: '简历分析', icon: '📋' },
  { id: 'optimize', label: '优化建议', icon: '✨' },
  { id: 'template', label: '简历模板', icon: '📄' },
  { id: 'history', label: '历史记录', icon: '📂' },
]

export const INDUSTRIES = [
  '互联网/IT', '金融', '教育', '医疗', '制造业', '零售', '媒体', '房地产', '咨询', '其他'
]

export const EXPERIENCE_LEVELS = [
  '应届生', '1-3年', '3-5年', '5-10年', '10年以上'
]

export const DEFAULT_RESUME = {
  name: '', phone: '', email: '', title: '',
  experience: '', education: '', skills: '', projects: '',
}

export const DEFAULT_JD = {
  company: '', position: '', requirements: '', description: '',
}
