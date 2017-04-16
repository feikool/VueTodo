import 'todomvc-app-css/index.css'

import Vue from 'vue'
// Vue的另一种载入方式  import 是es6的
// let Vue =require('vue')
var filters = { //定义是否选中的状态
  all(todos) {
    return todos
  },
  active(todos) {
    return todos.filter((todos) => {
      return !todos.completed
    })
  },
  completed(todos) {
    return todos.filter((todos) => {
      return todos.completed
    })
  }
}
let app = new Vue({
  el: '.todoapp',
  data: {
    msg: 'hello word',
    title: 'TodosMvc',
    newTodo: 'Vue实现Todo',
    todos: [{ //存放输入值的数组
      content: "vue",
      completed: false
    }, { //存放输入值的数组
      content: "vue-cli",
      completed: false
    }],
    editedTodo: null,
    hashName:'all'
  },
  computed: {
    // 计算属性
    remian() { //剩余多少
      return filters.active(this.todos).length //返回的是筛选出来的数组，取长度就行了
    },
    isAll: {
      get() { //当列表项全部选中的时候
        return this.remian === 0;
      },
      set(value) {
        this.todos.forEach((todo) => {
          todo.completed = value
        })
      }
    },
    filteredTodos(){
      // 过滤
      return filters[this.hashName](this.todos)
    }
  },
  methods: {
    addTodo(e) {
      //  console.log(e.target.value)
      if (!this.newTodo) {
        return;
      }
      this.todos.push({
        content: this.newTodo,
        completed: false
      })
      this.newTodo = "" //回车后将input框置空
    },
    removeTodo(index) {
      this.todos.splice(index, 1)
    },
    editTodo(todo) { //双击列表项 进行编辑
      this.editCache = todo.content //将双击按下时的value值缓存下
      this.editedTodo = todo
    },
    doneEdit(todo, index) { //编辑列表项 提交触发的方法
      this.editedTodo = null //将编辑状态的类名还原         
      if (!todo.content) {
        // 提交内容为空  那么删除这一行
        this.removeTodo(index)
      }
    },
    cancleEdit(todo) { //编辑中， esc取消编辑时触发的方法
      this.editedTodo = null //将编辑状态的类名还原         
      todo.content = this.editCache //将改变的内容还原为缓存
    },
    clear() { //删除已经完成项的方法
      this.todos = filters.active(this.todos)
    }
  },
  directives: {
    // 指令函数   用与设置自定义指令
    focus(el, value) {
      if (value) {
        el.focus();
      }
    },
  }
})
// new Vue({
//   el: '.info'
// })
// 全局的监听
function hashChange(){
  let hashName = location.hash.replace(/#\/?/,'')
  if(filters[hashName]){
    app.hashName = hashName
  }else{
    location.hash = ''
    app.hashName = 'all'
  }
}
window.addEventListener('hashchange',hashChange)