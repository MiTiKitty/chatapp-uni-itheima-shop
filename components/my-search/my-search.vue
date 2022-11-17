<template>
    <view class="my-search-box" :style="{'background-color': bgcolor}">
        <view class="my-search-input-box" :style="{'border-radius': radius + 'px'}" @click="searchBoxHandler">
            <uni-icons type="search" size="17"></uni-icons>
            <text class="placeholder">搜索</text>
        </view>
    </view>
</template>

<script>
    export default {
        name: "my-search",
        data() {
            return {

            };
        },
        props: {
          // 背景颜色
          bgcolor: {
            type: String,
            default: '#C00000'
          },
          // 圆角尺寸
          radius: {
            type: Number,
            // 单位是 px
            default: 15
          }
        },
        methods:{
            searchBoxHandler() {
                this.$emit('click')
            }
        }
    }
</script>

<style lang="scss">
    .my-search-box {
        display: flex;
        justify-content: center;
        text-align: center;

        .my-search-input-box {
            width: 80vw;
            height: 20px;
            border: #ff1100;
            padding: 5px;
            margin: 5px;
            background-color: #ffffff;

            .placeholder {
                font-size: 15px;
                margin-left: 5px;
            }
        }
    }
</style>
