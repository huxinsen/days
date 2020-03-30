const app = document.getElementById('app')
const deviceWidth = document.documentElement.clientWidth
const deviceHeight = document.documentElement.clientHeight

const STAR_MODE = 'star' // 星星✨
const ROSE_MODE = 'rose' // 玫瑰🌹
const CAKE_MODE = 'cake' // 蛋糕🎂
const CONGRATULATION_MODE = 'congratulation' // 恭喜🎉

const SPEED = 3 // 下落速度，单位px
const DROP_NUMBER = 22 // 一次下落的雨滴个数
const DROP_TIME_RANGE = 5000 // 下落时间点范围，单位毫秒
const INTERVAL_TIME = 10000 // 下雨时间间隔，单位毫秒
const BEGIN_YEAR = 2018 // 在一起年份
const BEGIN_DATE = '2018-12-02' // 在一起日期

// 运行代码输入
function runCodeTyping() {
  const el = document.getElementById('code-container')
  const code = el.innerHTML
  el.innerHTML = ''
  let index = 0
  const intervalID = setInterval(() => {
    const char = code.charAt(index)
    if (char === '<') {
      index = code.indexOf('>', index) + 1
    } else if (char === '&') {
      index = code.indexOf(';', index) + 1
    } else {
      index++
    }
    el.innerHTML =
      code.substring(0, index) +
      (index < code.length ? '<span class="underline">_</span>' : '')
    if (index >= code.length) {
      clearInterval(intervalID)
    }
  }, 80)
}

// 消息
class Message {
  constructor(content) {
    this.$el = document.createElement('div')
    this.$el.className = 'message'
    this.$el.style.top = '10px'
    this.$el.style.left = '12px'
    this.$el.append(content)
  }

  show() {
    app.appendChild(this.$el)
    setTimeout(() => {
      this.remove()
    }, 8000)
  }

  remove() {
    app.removeChild(this.$el)
  }
}

// 雨滴
class Drop {
  constructor(content) {
    // 初始化位置和方向，计算速度
    this.startX = Math.floor(
      deviceWidth * 0.2 + Math.random() * deviceWidth * 0.6
    ) // 起点在中部60%的位置
    this.startY = -70
    this.angle = Math.floor(Math.random() * 31) + 75 // 顺时针和 X 轴正方向夹角
    this.speedX = SPEED * Math.cos((this.angle * Math.PI) / 180)
    this.speedY = SPEED * Math.sin((this.angle * Math.PI) / 180)

    // 添加 DOM 元素
    this.$el = document.createElement('label')
    this.$el.className = 'drop'
    this.$el.style.top = this.startY + 'px'
    this.$el.style.left = this.startX + 'px'
    this.$el.append(content)
  }

  fall() {
    requestAnimationFrame(() => {
      this.move()
    })
  }

  move() {
    const top = Number(this.$el.style.top.slice(0, -2)) + this.speedY
    const left = Number(this.$el.style.left.slice(0, -2)) + this.speedX
    if (top < deviceHeight) {
      this.$el.style.top = top + 'px'
      this.$el.style.left = left + 'px'
      this.fall()
    } else {
      // 落出屏幕
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}

// 问候
function sendGreeting(messageContent, dropContent) {
  new Message(messageContent).show()
  setTimeout(() => {
    const dropList = []
    // 一次性加入所有雨滴
    const fragment = document.createDocumentFragment()
    for (let i = 0; i < DROP_NUMBER; i++) {
      dropList.push(new Drop(dropContent))
      fragment.appendChild(dropList[i].$el)
    }
    app.appendChild(fragment)

    for (let i = 0; i < DROP_NUMBER; i++) {
      setTimeout(() => {
        dropList[i].fall()
      }, Math.round(Math.random() * DROP_TIME_RANGE))
    }
  }, 600)
}

// 设置天数
function setDays() {
  const days =
    Math.floor((new Date() - new Date(BEGIN_DATE)) / (24 * 3600 * 1000)) + 1 // 加上在一起当天
  numAutoPlus('days-number', {
    time: 2000,
    num: days,
    regulator: 100,
  })
}

// 数字自增到某一值
function numAutoPlus(elementId, options) {
  const el = document.getElementById(elementId)
  const num = options.num // 数值
  const time = options.time // 自增时间
  const regulator = options.regulator // 改变数字的时间间隔
  const step = Math.floor(num / (time / regulator))
  let count = 0
  const timer = setInterval(() => {
    count += step
    if (count >= num) {
      clearInterval(timer)
      count = num
    }
    el.innerHTML = count
  }, regulator)
}

// 计算模式
function getMode() {
  // 公历日期
  const cDate = new Date()
  const cYear = cDate.getFullYear()
  const cMonth = cDate.getMonth() + 1
  const cDay = cDate.getDate()
  // 农历日期
  const lDate = calendar.solar2lunar(cYear, cMonth, cDay)
  const lMonth = lDate.lMonth
  const lDay = lDate.lDay

  let mode = STAR_MODE

  switch (true) {
    case cMonth === 2 && cDay === 14: // 情人节
    case cMonth === 5 && cDay === 20:
    case lMonth === 7 && lDay === 7:
      mode = ROSE_MODE
      break
    case lMonth === 1 && lDay === 15: // 农历生日
      mode = CAKE_MODE
      break
    case cMonth === 12 && cDay === 2: // 在一起纪念日
      mode = CONGRATULATION_MODE
      break
    default:
      break
  }

  return mode
}

// 运行计数
function runDaysCounting() {
  setDays()
  const mode = getMode()
  let dropContent
  let messageContent

  switch (mode) {
    case STAR_MODE:
      messageContent = '我想你了'
      dropContent = '✨'
      break
    case ROSE_MODE:
      messageContent = '宝贝，情人节快乐！我爱你😘😘😘'
      dropContent = '🌹'
      break
    case CAKE_MODE:
      messageContent = '宝贝，生日快乐！永远18岁呦～'
      dropContent = '🎂'
      break
    case CONGRATULATION_MODE:
      const yearNumber = new Date().getFullYear() - BEGIN_YEAR
      messageContent = `宝贝，${yearNumber}周年快乐！爱你呦😘`
      dropContent = '🎉'
      break
    default:
      messageContent = '我想你了'
      dropContent = '✨'
      break
  }

  setTimeout(() => {
    sendGreeting(messageContent, dropContent)
    setInterval(() => {
      sendGreeting(messageContent, dropContent)
    }, INTERVAL_TIME)
  }, 3000)
}

function main() {
  const codeElement = document.getElementById('code')
  const counterElement = document.getElementById('counter')
  counterElement.style.display = 'none'
  codeElement.addEventListener('webkitAnimationEnd', onRotateEnd)
  codeElement.addEventListener('mozAnimationEnd', onRotateEnd)
  codeElement.addEventListener('MSAnimationEnd', onRotateEnd)
  codeElement.addEventListener('oanimationend', onRotateEnd)
  codeElement.addEventListener('animationend', onRotateEnd)
  function onRotateEnd() {
    codeElement.style.display = 'none'
    setTimeout(() => {
      counterElement.style.display = ''
      runDaysCounting()
    }, 1000)
  }
  runCodeTyping()
}

main()
