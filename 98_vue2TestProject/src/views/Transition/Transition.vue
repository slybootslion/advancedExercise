<template>
  <div>
    <!--
      vue中的动画：
      当dom显示或者隐藏的时候，Vue可以管理动画：v-for v-if v-show
    -->
    <div class="box">
      <transition name="fade">
        <div class="show-box" v-show="isShow"></div>
      </transition>
    </div>
    <button @click="change">切换</button>

    <div class="cart-box">
      <ul>
        <li class="products-item" v-for="(item, index) in products" :key="item.price" ref="lists">
          <div class="item-price">商品价格：{{item.price}}</div>
          <div class="add-btn" @click="addGoods(index)">添加购物车</div>
        </li>
      </ul>
      <transition name="ball" @enter="enter" @after-enter="afterEnter">
        <div class="animate" v-if="ballShow"></div>
      </transition>
      <div class="cart" ref="cart">这是个购物车</div>
    </div>
    <p style="margin-top: 40px;">
      <router-link to="/">home</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: 'transition-comp',
  data: function () {
    return {
      isShow: false,
      ballShow: false,
      currentIndex: -1,
      products: [
        {
          price: 100
        }, {
          price: 300
        }, {
          price: 500
        }
      ]
    }
  },
  methods: {
    change () {
      this.isShow = !this.isShow
    },
    addGoods (index) {
      this.currentIndex = index
      this.ballShow = true
    },
    enter (el, done) {
      const item = this.$refs.lists[this.currentIndex]
      const { x, y } = item.getBoundingClientRect()
      el.style.left = `${x}px`
      el.style.top = `${y - 124}px`
      el.innerHTML = item.querySelector('.item-price').innerText
      const { x: cartX, y: cartY } = this.$refs.cart.getBoundingClientRect()
      el.style.transform = `translate3d(${cartX - x}px, ${cartY - y}px, 0) scale(0,0)`
      // 动画结束 调用done方法
      el.addEventListener('transitionend', done)
    },
    afterEnter (el) {
      this.ballShow = false
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  //@import "style/public";
  .box {
    width: 100px;
    height: 100px;

    .show-box {
      width: 100%;
      height: 100%;
      background-color: #ccc;
    }

    // 动画的部分
    // 进入
    .fade-enter {
      background-color: #00c;
    }

    .fade-enter-active {
      transition: all 2s linear;
    }

    .fade-enter-to {
      background-color: #c00;
    }

    // 离开
    // leave 为了美感而生，不生效，没有实际意义
    .fade-leave {
      background-color: #c00;
    }

    .fade-leave-active {
      transition: all 2s linear;
    }

    .fade-leave-to {
      background-color: #00c;
    }

  }

  .cart-box {
    width: 510px;
    height: 700px;
    border: 1px solid #ededed;
    position: relative;
    overflow: hidden;

    .products-item {
      width: 100%;
      height: 68px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      border: 1px solid #ccc;

      .item-price {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .add-btn {
        width: 120px;
        background-color: #c00;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
    }

    .cart {
      width: 120px;
      height: 90px;
      line-height: 90px;
      text-align: center;
      color: #ffffff;
      background-color: #E6A23C;
      position: absolute;
      bottom: 0;
      right: 0;
    }

    .animate {
      position: absolute;
      transition: 1s linear;
    }
  }
</style>
