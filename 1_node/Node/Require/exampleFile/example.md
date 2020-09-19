### 文件读取用

默认Vue在初始化数据时，会给data中的属性使用Object.defineProperty重新定义所有属性，当页面取到对应属性时。会进行依赖收集（收集当前组件的watcher），如果属性发生变化会通知相关依赖进行跟新操作。
默认Vue在初始化数据时，会给data中的属性使用Object.defineProperty重新定义所有属性，当页面取到对应属性时。会进行依赖收集（收集当前组件的watcher）end
