<template>
    <view>
        <my-search @click="gotoSearch"></my-search>
        <view class="scroll-view-container">
            <!-- 左侧滑动区域 -->
            <scroll-view class="left-scroll-view" scroll-y="true" :style="{height: wh + 'px'}">
                <block v-for="(item, index) in cateList" :key="item.cat_id">
                    <view :class="['left-scroll-view-item', index === active ? 'active' : '']"
                        @click="changeActive(index)">{{item.cat_name}}</view>
                </block>
            </scroll-view>
            <!-- 右侧滑动区域 -->
            <view class="right-box" :style="{height: wh + 'px'}">
                <scroll-view scroll-x="true" class="cate-lv2">
                    <view :class="['cate-lv2-title', i2 === check ? 'check' : '']" v-for="(item2, i2) in cateLevel2"
                        :key="item2.cat_id" @click="changeCheck(i2)">/ {{item2.cat_name}} /</view>
                </scroll-view>
                <scroll-view scroll-y="true" :style="{height: (wh - 60) + 'px'}" class="cate-lv3">
                    <view v-for="item3 in cateLevel3" :key="item3.cat_id" class="cate-lv3-item"
                        @click="gotoGoodsList(item3)">
                        <image
                            src="https://img0.baidu.com/it/u=2939476499,872239121&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500">
                        </image>
                        <text>{{item3.cat_name}}</text>
                    </view>
                </scroll-view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                wh: 0,
                // 分类数据列表
                cateList: [],
                active: 0,
                // 二级分类列表
                cateLevel2: [],
                check: 0,
                // 三级分类列表
                cateLevel3: [],
            };
        },
        onLoad() {
            // 动态获取当前屏幕的可用高度
            const info = uni.getSystemInfoSync()
            this.wh = info.windowHeight - 40
            this.getCateList()
        },
        methods: {
            async getCateList() {
                const {
                    data: res
                } = await uni.$http.get('/api/public/v1/categories');
                console.log(res);
                if (res.meta.status !== 200) {
                    return uni.$showMsg();
                }
                this.cateList = res.message;
                // 为二级分类赋值
                this.cateLevel2 = res.message[0].children;
                // 为三级分类赋值
                this.cateLevel3 = res.message[0].children[0].children;
            },
            changeActive(index) {
                this.active = index;
                this.cateLevel2 = this.cateList[index].children;
                this.cateLevel3 = this.cateLevel2[0].children;
                this.check = 0;
            },
            changeCheck(index) {
                this.check = index;
                this.cateLevel3 = this.cateLevel2[index].children;
            },
            gotoGoodsList(item) {
                uni.navigateTo({
                    url: '/subpkg/goods_list/goods_list?cid=' + item.cat_id
                })
            },
            gotoSearch() {
                uni.navigateTo({
                    url: '/subpkg/search/search'
                })
            }
        }
    }
</script>

<style lang="scss">
    .scroll-view-container {

        .left-scroll-view {
            display: inline-block;
            width: 30vw;
            float: left;

            .left-scroll-view-item {
                background-color: #f6f6f6;
                line-height: 60px;
                text-align: center;
                font-size: 12px;

                &.active {
                    background-color: #ffffff;
                    position: relative;

                    &::before {
                        content: ' ';
                        display: block;
                        width: 3px;
                        height: 30px;
                        background-color: #c00000;
                        position: absolute;
                        left: 0;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                }
            }
        }
    }

    .right-box {
        width: 70vw;
        float: right;
    }

    .cate-lv2 {
        width: 100%;
        height: 60px;
        text-align: center;
        background-color: #ffffff;
        white-space: nowrap;

        .cate-lv2-title {
            display: inline-block;
            line-height: 45px;
            font-size: 15px;
            padding: 5px;
            font-weight: 700;

            &.check {
                color: #c00000;
            }
        }
    }

    .cate-lv3 {
        justify-content: center;

        .cate-lv3-item {
            width: 30%;
            height: 90px;
            display: inline-block;
            margin: 5px 2px;

            image {
                width: 100%;
                height: 90%;
            }

            text {
                width: 100%;
                display: inline-block;
                text-align: center;
                font-size: 12px;
                line-height: 12px;
            }
        }
    }
</style>
