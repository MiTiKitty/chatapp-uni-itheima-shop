<template>
    <view>
        <view class="search-box">
            <my-search @click="gotoSearch"></my-search>
        </view>
        <!-- 轮播图区域 -->
        <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
            <!-- 循环渲染轮播图的 item 项 -->
            <swiper-item v-for="item in swiperList" :key="item.goods_id">
                <view class="swiper-item">
                    <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id"
                        :open-type="item.open_type">
                        <!-- 动态渲染轮播图的图片资源 -->
                        <image :src="item.image_src"></image>
                    </navigator>
                </view>
            </swiper-item>
        </swiper>
        <!-- 分类区域 -->
        <view class="nav-list">
            <view class="nav-item" v-for="(item, index) in navList" :key="index" @click="handlerClickToNav(index)">
                <image :src="item.image_src"></image>
            </view>
        </view>
        <!-- 楼层区域 -->
        <view class="floor-list-box">
            <view class="floor-box" v-for="(item, index) in floorList">
                <view class="floor-title">
                    <image :src="item.floor_title.image_src"></image>
                </view>
                <view class="product-list">
                    <view class="left-box">
                        <navigator class="floor-item" :url="item.product_list[0].url" open-type="navigate">
                            <image :src="item.product_list[0].image_src"></image>
                        </navigator>
                    </view>
                    <view class="right-box">
                        <navigator class="floor-item" v-for="(pro, index) in item.product_list" :key="index"
                            v-if="index !== 0" :url="pro.url" open-type="navigate">
                            <image :src="pro.image_src"></image>
                        </navigator>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                // 声明轮播图的数据列表
                swiperList: [],
                // 声明一个分类列表
                navList: [],
                // 声明一个楼层列表
                floorList: [],
            };
        },
        onLoad() {
            // 调用一次获取轮播图的方法
            this.getSwiperList()
            // 调用一次获取分类的方法
            this.getNavList()
            // 调用一次获取楼层的方法
            this.getFloorList()
        },
        methods: {
            // 定义获取轮播图的方法
            async getSwiperList() {
                // 发起请求获取数据
                const {
                    data: res
                } = await uni.$http.get('/api/public/v1/home/swiperdata')
                // console.log(res);
                /**
                 *  goods_id: (...)
                 *  image_src: (...)
                 *  navigator_url: (...)
                 *  open_type: (...)
                 */
                // 请求失败，返回错误信息
                if (res.meta.status !== 200) {
                    return uni.$showMsg()
                }
                // 把响应回来的数据赋值给轮播图数据列表
                this.swiperList = res.message
            },
            // 定义获取分类列表的方法
            async getNavList() {
                const {
                    data: res
                } = await uni.$http.get('/api/public/v1/home/catitems')
                // console.log('返回结果', res);
                // // image_src: "https://static.botue.com/ugo/uploads/icon_index_nav_4@2x.png"
                // // name: "分类"
                // // navigator_url: "/pages/category/main"
                // // open_type: "switchTab"
                if (res.meta.status !== 200) {
                    return uni.$showMsg()
                }
                this.navList = res.message
            },
            // 定义一个监听分类栏，并跳转到分类的方法
            handlerClickToNav(index) {
                if (index === 0) {
                    uni.switchTab({
                        url: '/pages/cate/cate'
                    })
                }
            },
            // 定义一个获取楼层数据的方法
            async getFloorList() {
                const {
                    data: res
                } = await uni.$http.get('/api/public/v1/home/floordata');
                // console.log('返回结果', res);
                if (res.meta.status !== 200) {
                    return uni.$showMsg()
                }
                res.message.forEach(floor => {
                    floor.product_list.forEach(prod => {
                        prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
                    })
                })
                this.floorList = res.message
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
    swiper {
        height: 300rpx;

        .swiper-item,
        image {
            height: 100%;
            width: 100%;
        }
    }

    .nav-list {
        height: 174rpx;
        margin: 5px 10px;
        display: flex;
        justify-content: space-around;

        .nav-item {
            width: 25%;
            height: 100%;

            image {
                height: 100%;
                width: 100%;
            }
        }
    }

    .floor-list-box {
        margin: 5px 10px;
    }

    .floor-box {
        margin: 20rpx 6rpx;

        .floor-title {
            height: 60rpx;

            image {
                width: 100%;
                height: 100%;
            }
        }

        .product-list {
            height: 420rpx;
            display: flex;
            justify-content: space-around;

            .floor-item {
                width: 100%;
                height: 100%;

                image {
                    width: 100%;
                    height: 100%;
                }
            }

            .left-box {
                width: 30%;
                height: 96%;
                display: inline-block;
            }

            .right-box {
                width: 70%;
                height: 100%;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-around;


                .floor-item {
                    width: 49%;
                    height: 46%;
                    text-align: center;

                    image {
                        width: 90%;
                        height: 100%;
                    }
                }
            }

        }
    }

    .search-box {
        position: sticky;
        z-index: 999;
        top: 0;
    }
</style>
